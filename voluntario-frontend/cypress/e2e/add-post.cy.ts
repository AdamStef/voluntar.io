describe('Adding posts test', () => {
  it('add post', () => {
    cy.visit('http://localhost:5173/login');
    cy.get("input[name='email']").type('organization@test.com');
    cy.get("input[name='password']").type('testpassword');
    cy.get("button[type='submit']").click();

    cy.url().should('include', '/home');

    // cy.visit('http://localhost:5173/home');
    cy.get('#see-more-org').first().click();
    cy.contains('Dyskusja').click();

    cy.url().should('include', 'discussion');
    cy.get('textarea').type('testowy post');
    cy.contains('Opublikuj').click();

    cy.get('#post-content').should('contain', 'testowy post');
  });
});
