describe('Events', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
    cy.get("input[name='email']").type('volunteer@test.com');
    cy.get("input[name='password']").type('testpassword');
    cy.get("button[type='submit']").click();

    cy.url().should('include', '/home');
  });

  it('Join event', () => {
    cy.visit('http://localhost:5173/events');
    cy.get('#see-more-btn').click();

    cy.contains('Dołącz').click();

    cy.contains('Dołącz').should('not.exist');

    // cy.get("input[name='description']").type('test description');
    // cy.get("input[name='date']").type('2022-12-12');
    // cy.get("input[name='time']").type('12:00');
    // cy.get("input[name='location']").type('test location');
    // cy.get("input[name='maxParticipants']").type('10');
    // cy.get("button[type='submit']").click();
    // cy.url().should('include', '/events');
  });

  afterEach(() => {
    cy.contains('Opuść').click();
  });
});
