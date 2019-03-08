const { Fight } = require('../src');

describe('Fights', () => {
  describe('Resolve fights', () => {
    let fight = {
      attacker: {
        units: [
          {
            key: 'bouncer',
            amount: 12,
          },
          {
            key: 'knifer',
            amount: 34,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'knifer',
            amount: 1,
          },
        ],
      },
    };

    let expected = {
      result: 1,
      attacker: {
        units: [
          {
            key: 'bouncer',
            amount: 12,
          },
          {
            key: 'knifer',
            amount: 34,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'knifer',
            amount: 1,
            dead: 1,
          },
        ],
      },
    };

    it('should win', () => {
      expect(new Fight(fight).fight()).toEqual(expected);
    });

    fight = {
      attacker: {
        units: [
          {
            key: 'bouncer',
            amount: 5,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'bouncer',
            amount: 6,
          },
          {
            key: 'knifer',
            amount: 7,
          },
        ],
      },
    };

    expected = {
      result: 3,
      attacker: {
        units: [
          {
            key: 'bouncer',
            amount: 5,
            dead: 5,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'bouncer',
            amount: 6,
            dead: 5,
          },
          {
            key: 'knifer',
            amount: 7,
          },
        ],
      },
    };

    it('should lost', () => {
      expect(new Fight(fight).fight()).toEqual(expected);
    });

    fight = {
      attacker: {
        units: [
          {
            key: 'bouncer',
            amount: 8,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'bouncer',
            amount: 8,
          },
        ],
      },
    };

    expected = {
      result: 2,
      attacker: {
        units: [
          {
            key: 'bouncer',
            amount: 8,
            dead: 8,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'bouncer',
            amount: 8,
            dead: 8,
          },
        ],
      },
    };

    it('should draw', () => {
      expect(new Fight(fight).fight()).toEqual(expected);
    });

    fight = {
      attacker: {
        units: [
          {
            key: 'bouncer',
            amount: 5,
          },
          {
            key: 'rowdy',
            amount: 10,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'big_mama',
            amount: 1,
          },
          {
            key: 'mercenary',
            amount: 1,
          },
        ],
      },
    };

    expected = {
      result: 3,
      attacker: {
        units: [
          {
            key: 'bouncer',
            amount: 5,
            dead: 5,
          },
          {
            key: 'rowdy',
            amount: 10,
            dead: 10,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'big_mama',
            amount: 1,
          },
          {
            key: 'mercenary',
            amount: 1,
          },
        ],
      },
    };

    it('should respect priority', () => {
      expect(new Fight(fight).fight()).toEqual(expected);
    });

    fight = {
      attacker: {
        units: [
          {
            key: 'ninja',
            amount: 5,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'rowdy',
            amount: 1,
          },
          {
            key: 'knifer',
            amount: 1,
          },
        ],
      },
    };

    expected = {
      result: 1,
      attacker: {
        units: [
          {
            key: 'ninja',
            amount: 5,
          },
        ],
      },
      target: {
        units: [
          {
            key: 'rowdy',
            amount: 1,
            dead: 1,
          },
          {
            key: 'knifer',
            amount: 1,
            dead: 1,
          },
        ],
      },
    };

    it('should not kill ninja', () => {
      expect(new Fight(fight).fight()).toEqual(expected);
    });
  });
});
