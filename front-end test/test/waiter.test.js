import { Waiter } from '../app.js'
mocha.setup('bdd');
let assert = chai.assert;
mocha.checkLeaks();
mocha.run();
describe('Waiters Name', () => {
    describe("Name Validation", () => {
        it('should not be empty', () => {
            const waiter = Waiter()
            waiter.setName('')
            assert.equal('Enter name!', waiter.getName())
        });
        it('should remove all numbers in alphanumeric string and return name', () => {
            const waiter = Waiter()
            waiter.setName('56Z56e56zeth565u565')
            assert.equal('Zezethu', waiter.getName())
        });
        it('should remove all spaces in alphanumeric string and return name', () => {
            const waiter = Waiter()
            waiter.setName('   2yo3ne5235564la   ')
            assert.equal('Yonela', waiter.getName())
        });
        it('should start name with an uppercase', () => {
            const waiter = Waiter()
            waiter.setName('thamsangqa')
            assert.equal('Thamsangqa', waiter.getName())
        });
        it('should return error if numbers is entered', () => {
            const waiter = Waiter()
            waiter.setName(12322)
            assert.equal('Name should be alphabets only!', waiter.getName())
        });
    });
})