const expect = require("expect");
const request = require("supertest");

const app = require("./../server");
const db = require("./../db/lokijs");

function seedDb() {
  let testUsers = [];
  let testProjects = [];

  testUsers.push(db.insert({ name: "test user 1" }, "user"));
  testUsers.push(db.insert({ name: "test user 2" }, "user"));
  testUsers.push(db.insert({ name: "test user 3" }, "user"));
  testProjects.push(
    db.insert(
      {
        name: "test project 1",
        date: "2014-12-12",
        year: 2014,
        month: 12,
        day: 12
      },
      "project"
    )
  );
  testProjects.push(
    db.insert(
      {
        name: "test project 2",
        date: "1928-01-06",
        year: 1928,
        month: 01,
        day: 06
      },
      "project"
    )
  );
  testProjects.push(
    db.insert(
      {
        name: "test project 3",
        date: "2002-08-30",
        year: 2002,
        month: 08,
        day: 30
      },
      "project"
    )
  );

  return { testUsers, testProjects };
}

beforeEach(done => {
  db.useDb("test-db");
  db
    .getCollection("user")
    .chain()
    .remove();
  done();
});

describe("Post users/:id/like", () => {
  it("should add a new liked project to the user", done => {
    let { testUsers, testProjects } = seedDb();
    request(app)
      .post(`/users/${testUsers[0].id}/like`)
      .send({ project: testProjects[0].id })
      .expect(200)
      .expect(response => {
        expect(response.body.likes).toEqual([testProjects[0]]);
      })
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        expect(db.getCollection("user").get(testUsers[0].id).likes.length).toBe(
          1
        );
        done();
      });
  });

  it("should add additional liked projects to the user", done => {
    let { testUsers, testProjects } = seedDb();
    dbUser = db.getCollection("user").get(testUsers[0].id);
    dbProject = db.getCollection("project").get(testProjects[0].id);
    dbUser.likes = [dbProject];
    request(app)
      .post(`/users/${testUsers[0].id}/like`)
      .send({ project: testProjects[1].id })
      .expect(200)
      .expect(response => {
        expect(response.body.likes).toEqual([testProjects[0], testProjects[1]]);
      })
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        expect(db.getCollection("user").get(testUsers[0].id).likes.length).toBe(
          2
        );
        done();
      });
  });

  it("should ignore duplicate likes", done => {
    let { testUsers, testProjects } = seedDb();
    dbUser = db.getCollection("user").get(testUsers[0].id);
    dbProject = db.getCollection("project").get(testProjects[0].id);
    dbUser.likes = [dbProject];
    request(app)
      .post(`/users/${testUsers[0].id}/like`)
      .send({ project: testProjects[0].id })
      .expect(200)
      .expect(response => {
        expect(response.body.likes).toEqual([testProjects[0]]);
      })
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        expect(db.getCollection("user").get(testUsers[0].id).likes.length).toBe(
          1
        );
        done();
      });
  });

  it("should return an error for an invalid project id", done => {
    let { testUsers, testProjects } = seedDb();
    request(app)
      .post(`/users/${testUsers[0].id}/like`)
      .send({ project: 123 })
      .expect(400)
      .end(done);
  });
});

describe("Delete users/:id/like/:projectid", () => {
  it("should remove a liked project to the user", done => {
    let { testUsers, testProjects } = seedDb();
    dbUser = db.getCollection("user").get(testUsers[0].id);
    dbProject = db.getCollection("project").get(testProjects[0].id);
    dbUser.likes = [dbProject];
    request(app)
      .delete(`/users/${testUsers[0].id}/like/${testProjects[0].id}`)
      .send()
      .expect(200)
      .expect(response => {
        expect(response.body.likes).toEqual([]);
      })
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        expect(db.getCollection("user").get(testUsers[0].id).likes.length).toBe(
          0
        );
        done();
      });
  });

  it("should keep other likes project after removing one", done => {
    let { testUsers, testProjects } = seedDb();
    dbUser = db.getCollection("user").get(testUsers[0].id);
    dbProject1 = db.getCollection("project").get(testProjects[0].id);
    dbProject2 = db.getCollection("project").get(testProjects[1].id);
    dbUser.likes = [dbProject1, dbProject2];
    request(app)
      .delete(`/users/${testUsers[0].id}/like/${testProjects[0].id}`)
      .send()
      .expect(200)
      .expect(response => {
        expect(response.body.likes).toEqual([testProjects[1]]);
      })
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        expect(db.getCollection("user").get(testUsers[0].id).likes.length).toBe(
          1
        );
        done();
      });
  });
});
