describe('Tic Tac Toe Game', () => {
  beforeEach(() => {
    cy.setState(2).clearLocalStorage();
  });

  describe('as admin', () => {
    beforeEach(() => {
      cy.login('admin', '123456');
      cy.requestApi({
        method: 'POST',
        url: '/tic-tac-toe/game',
        body: {
          playerOUsername: 'e2e-user3',
          playerXUsername: 'e2e-user4',
          isPrivate: true,
        },
      }).then((xhr) => cy.visit(`/tic-tac-toe/games/${xhr.body.id}`));
    });

    it.only('should play a complete game', () => {
      cy.wait(10000);
    });

    it('should reject game', () => {});
  });
});
