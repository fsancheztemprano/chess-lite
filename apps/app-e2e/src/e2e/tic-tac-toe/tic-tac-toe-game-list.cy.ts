describe('Tic Tac Toe Game List', () => {
  beforeEach(() => {
    cy.setState(2).clearLocalStorage();
  });

  it('list user and public games', () => {
    cy.login('e2e-user1', 'e2e-user1');
    cy.visit('/tic-tac-toe/games');

    assertGameListLenth(5);
    assertGameRow('e2e-user2', 'e2e-user3', false, 0, 'IN_PROGRESS');
    assertGameRow('e2e-user1', 'e2e-user5', true, 1, 'FINISHED');
    assertGameRow('e2e-user1', 'e2e-user4', true, 2, 'REJECTED');
    assertGameRow('e2e-user1', 'e2e-user3', false, 3, 'IN_PROGRESS');
    assertGameRow('e2e-user1', 'e2e-user2', false, 4, 'PENDING');
  });

  it('list all games', () => {
    cy.login('admin', '123456');
    cy.visit('/tic-tac-toe/games');

    assertGameListLenth(6);
    assertGameRow('e2e-user2', 'e2e-user4', true, 0, 'REJECTED');
    assertGameRow('e2e-user2', 'e2e-user3', false, 1, 'IN_PROGRESS');
    assertGameRow('e2e-user1', 'e2e-user5', true, 2, 'FINISHED');
    assertGameRow('e2e-user1', 'e2e-user4', true, 3, 'REJECTED');
    assertGameRow('e2e-user1', 'e2e-user3', false, 4, 'IN_PROGRESS');
    assertGameRow('e2e-user1', 'e2e-user2', false, 5, 'PENDING');
  });

  describe('sidebar filters', () => {
    beforeEach(() => {
      cy.interceptApi('GET', '/tic-tac-toe/game*').as('getGames');
      cy.login('e2e-user1', 'e2e-user1');
      cy.visit('/tic-tac-toe/games');
      cy.get('[data-cy="toggle-sidebar-button"]').click();
    });

    it('should filter games by current user', () => {
      cy.get('#formly_3_toggle_myGames_0-button').click();
      cy.wait('@getGames').its('response.statusCode').should('eq', 200);
      assertGameListLenth(4);
      assertGameRow('e2e-user1', 'e2e-user5', true, 0, 'FINISHED');
      assertGameRow('e2e-user1', 'e2e-user4', true, 1, 'REJECTED');
      assertGameRow('e2e-user1', 'e2e-user3', false, 2, 'IN_PROGRESS');
      assertGameRow('e2e-user1', 'e2e-user2', false, 3, 'PENDING');
    });

    it('should filter games by username', () => {
      cy.get('#formly_3_autocomplete_player_1').type('e2e-user2');
      cy.get('#mat-option-3').click();
      cy.wait('@getGames').its('response.statusCode').should('eq', 200);
      assertGameListLenth(2);
      assertGameRow('e2e-user2', 'e2e-user3', false, 0, 'IN_PROGRESS');
      assertGameRow('e2e-user1', 'e2e-user2', false, 1, 'PENDING');
    });

    it('should filter games by pending status', () => {
      cy.get('#formly_3_multicheckbox_status_2_0').within(() => {
        cy.get('label').should('contain', 'Pending');
        cy.get('input').click();
      });
      cy.wait('@getGames').its('response.statusCode').should('eq', 200);
      assertGameListLenth(1);
      assertGameRow('e2e-user1', 'e2e-user2', false, 0, 'PENDING');
    });

    it('should filter games by in progress status', () => {
      cy.get('#formly_3_multicheckbox_status_2_1').within(() => {
        cy.get('label').should('contain', 'In Progress');
        cy.get('input').click();
      });
      cy.wait('@getGames').its('response.statusCode').should('eq', 200);
      assertGameListLenth(2);
      assertGameRow('e2e-user2', 'e2e-user3', false, 0, 'IN_PROGRESS');
      assertGameRow('e2e-user1', 'e2e-user3', false, 1, 'IN_PROGRESS');
    });

    it('should filter games by rejected status', () => {
      cy.get('#formly_3_multicheckbox_status_2_2').within(() => {
        cy.get('label').should('contain', 'Rejected');
        cy.get('input').click();
      });
      cy.wait('@getGames').its('response.statusCode').should('eq', 200);
      assertGameListLenth(1);
      assertGameRow('e2e-user1', 'e2e-user4', true, 0, 'REJECTED');
    });

    it('should filter games finished status', () => {
      cy.get('#formly_3_multicheckbox_status_2_3').within(() => {
        cy.get('label').should('contain', 'Finished');
        cy.get('input').click();
      });
      cy.wait('@getGames').its('response.statusCode').should('eq', 200);
      assertGameListLenth(1);
      assertGameRow('e2e-user1', 'e2e-user5', true, 0, 'FINISHED');
    });
  });

  function assertGameRow(userX: string, userO: string, isPrivate: boolean, index: number, status: string) {
    cy.get('.mdc-data-table__content')
      .children()
      .eq(index)
      .within(() => {
        cy.get('.cdk-column-status > .status-icon').should('have.class', status.toLowerCase());
        cy.get('.cdk-column-isPrivate > .mat-icon').should('contain', isPrivate ? 'lock' : 'public');
        cy.get('.cdk-column-playerX').should('contain', userX);
        cy.get('.cdk-column-playerO').should('contain', userO);
      });
  }

  function assertGameListLenth(length: number) {
    cy.get('.mdc-data-table__content').children().should('have.length', length);
  }
});
