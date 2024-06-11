describe('Login volunteer', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/login');
    cy.get("input[name='email']").type('volunteer@test.com');
    cy.get("input[name='password']").type('testpassword');
    cy.get("button[type='submit']").click();

    cy.url().should('include', '/home');
  });
});

describe('Login admin', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/login');
    cy.get("input[name='email']").type('admin@test.com');
    cy.get("input[name='password']").type('testpassword');
    cy.get("button[type='submit']").click();

    cy.url().should('include', '/home');
  });
});

describe('Login organization', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/login');
    cy.get("input[name='email']").type('organization@test.com');
    cy.get("input[name='password']").type('testpassword');
    cy.get("button[type='submit']").click();

    cy.url().should('include', '/home');
  });
});
