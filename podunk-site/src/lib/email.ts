import nodemailer from 'nodemailer'

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendPasswordResetEmail(to: string, resetToken: string, userName: string) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject: 'Reset Your Podunk Ramblers Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #13477B; padding: 2rem; text-align: center;">
            <h1 style="color: white; margin: 0;">Podunk Ramblers</h1>
          </div>
          
          <div style="padding: 2rem; background-color: #f9f9f9;">
            <h2 style="color: #13477B;">Password Reset Request</h2>
            
            <p>Hi ${userName},</p>
            
            <p>We received a request to reset your password for your Podunk Ramblers band member account.</p>
            
            <div style="text-align: center; margin: 2rem 0;">
              <a href="${resetUrl}" 
                 style="background-color: #13477B; color: white; padding: 1rem 2rem; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;
                        display: inline-block;">
                Reset Your Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 0.9rem;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #13477B;">${resetUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 0.9rem;">
              This link will expire in 1 hour for security reasons.
            </p>
            
            <p style="color: #666; font-size: 0.9rem;">
              If you didn't request this password reset, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 2rem 0;">
            
            <p style="color: #666; font-size: 0.8rem; text-align: center;">
              This email was sent from the Podunk Ramblers band management system.
            </p>
          </div>
        </div>
      `,
      text: `
        Hi ${userName},
        
        We received a request to reset your password for your Podunk Ramblers band member account.
        
        Please click the following link to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, you can safely ignore this email.
        
        - Podunk Ramblers
      `
    }

    try {
      await this.transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Error sending password reset email:', error)
      return false
    }
  }

  async sendWelcomeEmail(to: string, userName: string, temporaryPassword: string) {
    const loginUrl = `${process.env.APP_URL}/login`
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject: 'Welcome to Podunk Ramblers Band Dashboard',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #13477B; padding: 2rem; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Podunk Ramblers!</h1>
          </div>
          
          <div style="padding: 2rem; background-color: #f9f9f9;">
            <h2 style="color: #13477B;">Your Band Member Account is Ready</h2>
            
            <p>Hi ${userName},</p>
            
            <p>Your account has been created for the Podunk Ramblers band management system!</p>
            
            <div style="background-color: white; padding: 1.5rem; border-radius: 5px; margin: 1.5rem 0;">
              <h3 style="color: #13477B; margin-top: 0;">Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${to}</p>
              <p><strong>Temporary Password:</strong> <code style="background-color: #f0f0f0; padding: 0.25rem 0.5rem; border-radius: 3px;">${temporaryPassword}</code></p>
            </div>
            
            <div style="text-align: center; margin: 2rem 0;">
              <a href="${loginUrl}" 
                 style="background-color: #13477B; color: white; padding: 1rem 2rem; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;
                        display: inline-block;">
                Login to Dashboard
              </a>
            </div>
            
            <p style="color: #dc3545; font-weight: bold;">
              ⚠️ Important: Please change your password after your first login for security.
            </p>
            
            <p>You can now access the band dashboard to:</p>
            <ul>
              <li>Track band expenses and revenue</li>
              <li>View financial summaries</li>
              <li>Add new transactions</li>
              <li>Access band resources</li>
            </ul>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 2rem 0;">
            
            <p style="color: #666; font-size: 0.8rem; text-align: center;">
              This email was sent from the Podunk Ramblers band management system.
            </p>
          </div>
        </div>
      `
    }

    try {
      await this.transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }
}

export const emailService = new EmailService()