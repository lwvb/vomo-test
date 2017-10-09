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
  });
});

describe('Get /users', () => {
  it('should return an empty list when there are no users', (done) => {
    request(app)
      .get('/users')
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual([]);
      })
      .end(done);
  });

  it('should return all the users', (done) => {
    let testUsers = []

    testUsers.push(db.insert({name: 'test user 1'}, 'user'));
    testUsers.push(db.insert({name: 'test user 2'}, 'user'));
    testUsers.push(db.insert({name: 'test user 3'}, 'user'));
    
    request(app)
      .get('/users')
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(testUsers);
      })
      .end(done);
     
  });
});


describe('Get /users/:id', () => {
  it('should return a 404 not found for when there is no user with given id', (done) => {
    request(app)
      .get('/users/0')
      .expect(404)
      .end(done);
  });

  it('should return the user with given id', (done) => {
    let testUsers = []

    testUsers.push(db.insert({name: 'test user 1'}, 'user'));
    testUsers.push(db.insert({name: 'test user 2'}, 'user'));
    testUsers.push(db.insert({name: 'test user 3'}, 'user'));
    
    request(app)
      .get('/users/'+testUsers[1].id)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(testUsers[1]);
      })
      .end(done);
     
  });

  
  it('should return an error for an invalid id', (done) => {
    request(app)
     .get('/users/a')
     .expect(400)
     .end(done);
  });
});


describe('delete /users/:id', () => {
  it('should return a 404 not found for when there is no user with given id', (done) => {
    request(app)
      .delete('/users/0')
      .expect(404)
      .end(done);
  });

  it('should remove the user with given id', (done) => {
    let testUsers = []

    testUsers.push(db.insert({name: 'test user 1'}, 'user'));
    testUsers.push(db.insert({name: 'test user 2'}, 'user'));
    testUsers.push(db.insert({name: 'test user 3'}, 'user'));
    
    request(app)
      .delete('/users/'+testUsers[1].id)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({name: 'test user 2'});
      })
      .end((error, response) => {
        if(error) {
          done(error);
          return;
        }
        
        expect(db.getCollection('user').get(testUsers[1].id)).toBe(null);
        done();
      });
  });

  
  it('should return an error for an invalid id', (done) => {
    request(app)
     .delete('/users/a')
     .expect(400)
     .end(done);
  });
});