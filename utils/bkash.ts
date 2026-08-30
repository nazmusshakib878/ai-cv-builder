/**
 * Resumate AI — bKash Merchant Payment Gateway Service
 * Handles server-side bKash tokenization, payment intent creation, execution, and verification.
 */

export interface BkashConfig {
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  baseUrl: string;
}

export interface CreatePaymentResult {
  paymentID: string;
  bkashURL: string;
  status: string;
  amount: string;
  currency: string;
}

export interface ExecutePaymentResult {
  paymentID: string;
  trxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  customerMsisdn?: string;
  paymentExecuteTime?: string;
}

class BkashService {
  private config: BkashConfig | null = null;
  private idToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    const appKey = process.env.BKASH_APP_KEY;
    const appSecret = process.env.BKASH_APP_SECRET;
    const username = process.env.BKASH_USERNAME;
    const password = process.env.BKASH_PASSWORD;
    const baseUrl = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh';

    if (appKey && appSecret && username && password) {
      this.config = { appKey, appSecret, username, password, baseUrl };
    }
  }

  public isConfigured(): boolean {
    return this.config !== null;
  }

  /**
   * Acquire or reuse bKash auth token
   */
  private async getAuthToken(): Promise<string> {
    if (!this.config) {
      throw new Error('bKash credentials not configured.');
    }

    if (this.idToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.idToken;
    }

    const res = await fetch(`${this.config.baseUrl}/v1.2.0-beta/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        username: this.config.username,
        password: this.config.password,
      },
      body: JSON.stringify({
        app_key: this.config.appKey,
        app_secret: this.config.appSecret,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.id_token) {
      throw new Error(data.statusMessage || 'Failed to grant bKash token');
    }

    this.idToken = data.id_token;
    // Token is valid for 3600 seconds
    this.tokenExpiresAt = Date.now() + (parseInt(data.expires_in, 10) || 3600) * 1000;
    return this.idToken!;
  }

  /**
   * 1. Create bKash Payment Intent (Fixed 50 BDT)
   */
  public async createPayment(
    resumeId: string,
    callbackUrl: string,
    invoiceNumber: string = `INV-${Date.now()}`
  ): Promise<CreatePaymentResult> {
    // If real credentials exist, call bKash gateway
    if (this.isConfigured()) {
      const token = await this.getAuthToken();
      const res = await fetch(`${this.config!.baseUrl}/v1.2.0-beta/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-APP-Key': this.config!.appKey,
        },
        body: JSON.stringify({
          mode: '0011',
          payerReference: resumeId,
          callbackURL: callbackUrl,
          amount: '50.00', // FIXED PRICE: 50 BDT
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: invoiceNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.paymentID) {
        throw new Error(data.statusMessage || 'bKash create payment failed');
      }

      return {
        paymentID: data.paymentID,
        bkashURL: data.bkashURL,
        status: data.transactionStatus || 'Initiated',
        amount: '50.00',
        currency: 'BDT',
      };
    }

    // Isolated Mock Payment Simulator for Development & Testing
    if (process.env.NODE_ENV === 'production') {
      throw new Error('bKash payment gateway configuration is missing in production environment.');
    }

    const mockPaymentId = `BKASH_MOCK_PAY_${Date.now()}`;
    const mockRedirectUrl = `${callbackUrl}?paymentID=${mockPaymentId}&status=success&resumeId=${encodeURIComponent(
      resumeId
    )}`;

    return {
      paymentID: mockPaymentId,
      bkashURL: mockRedirectUrl,
      status: 'Initiated',
      amount: '50.00',
      currency: 'BDT',
    };
  }

  /**
   * 2. Execute & Verify bKash Payment
   */
  public async executePayment(paymentID: string): Promise<ExecutePaymentResult> {
    if (this.isConfigured()) {
      const token = await this.getAuthToken();
      const res = await fetch(`${this.config!.baseUrl}/v1.2.0-beta/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-APP-Key': this.config!.appKey,
        },
        body: JSON.stringify({ paymentID }),
      });

      const data = await res.json();
      if (!res.ok || data.statusCode !== '0000' || data.transactionStatus !== 'Completed') {
        throw new Error(data.statusMessage || 'bKash payment execution failed or incomplete');
      }

      return {
        paymentID: data.paymentID,
        trxID: data.trxID,
        transactionStatus: 'Completed',
        amount: data.amount || '50.00',
        currency: data.currency || 'BDT',
        customerMsisdn: data.customerMsisdn,
        paymentExecuteTime: data.paymentExecuteTime,
      };
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('bKash payment gateway configuration is missing in production environment.');
    }

    // Mock Execution for Dev
    return {
      paymentID,
      trxID: `TRX_MOCK_${Date.now().toString(36).toUpperCase()}`,
      transactionStatus: 'Completed',
      amount: '50.00',
      currency: 'BDT',
      customerMsisdn: '01700000000',
      paymentExecuteTime: new Date().toISOString(),
    };
  }
}

export const bkash = new BkashService();
