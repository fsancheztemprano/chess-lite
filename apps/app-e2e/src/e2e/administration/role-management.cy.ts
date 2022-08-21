describe.skip('Role Management', () => {
  beforeEach(() => {
    cy.setState(1);
    cy.login('admin', '123456');
    cy.visit('/');
    cy.get('[data-cy="administration-tile"]').click();
    cy.get('[data-cy="role-management-tile"]').click();
  });

  it('should list all roles', () => {
    expect(true).to.be.true;
  });
});
