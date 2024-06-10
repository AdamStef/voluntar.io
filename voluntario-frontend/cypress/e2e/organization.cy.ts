describe('Verify organization', () => {
  it('create organization', () => {
    cy.visit('http://localhost:5173/register/organization');

    cy.get("input[name='krs']").type('123123123');
    cy.get("input[name='firstName']").type('test');
    cy.get("input[name='lastName']").type('test');
    cy.get("input[name='email']").type('organization9@test.com');
    cy.get("input[name='password']").type('testpassword');
    cy.get("input[name='passwordConfirmation']").type('testpassword');
    cy.get("input[name='name']").type('test');
    cy.get("input[name='address']").type('test');
    cy.get("input[name='phoneNumber']").type('123456789');
    cy.get("input[name='website']").type('test.com');
    cy.get("textarea[name='description']").type('test description');
    cy.contains('Mężczyzna').click();
    cy.get("button[type='submit']").click();

    cy.url().should('include', '/login');
  });

  it('verify organization', () => {
    cy.visit('http://localhost:5173/login');
    cy.get("input[name='email']").type('admin@test.com');
    cy.get("input[name='password']").type('testpassword');
    cy.get("button[type='submit']").click();

    cy.url().should('include', '/home');

    cy.visit('http://localhost:5173/verify');

    cy.contains('Akceptuj').click();

    cy.get('#verify-org-list').should('not.exist');
  });
});
