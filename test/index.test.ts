import { doesNotMatch } from 'assert';
import chai from 'chai';
import { agent as request } from 'supertest';
import app from '../src/index';

const expect = chai.expect;

// test for default get
describe('Parent', () => {
    // Test default /GET route
    describe('/GET /', () => {
        it('it should get words', (done) => {
            request(app)
                .get('/')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });

    describe('PASS', () => {
        it('should always pass', (done) => {
            expect(true).to.equal(false);
            done();
        });
    });
});
