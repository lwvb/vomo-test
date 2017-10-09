const expect = require('expect');
const request = require('supertest');

const app = require('./../server');
const db = require('./../db/lokijs');



beforeEach((done) => {
  db.useDb('test-db');
  db.getCollection('user').chain().remove();
  done();
})


describe('Post /user', () => {
  it('should create a new user', (done) => {
    var name = 'test user';
    request(app)
      .post('/users')
      .send({name})
      .expect(200)
      .expect((response) => {
        expect(response.body.name).toBe(name);
      })
      .end((error, response) => {
        if(error) {
          done(error);
          return;
        }
        expect(db.getCollection('user').find({name}).length).toBe(1);
        done();
      });
  });

  
  it('should not create a new user without a name', (done) => {
    request(app)
     .post('/users')
     .send()
     .expect(400)
     .end((error, response) => {
       if(error) {
         done(error);
         return;
       }
       expect(db.getCollection('user').find().length).toBe(0);
       done();
     });
 })
});