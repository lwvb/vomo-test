const expect = require("expect");
const request = require("supertest");

const app = require("./../server");
const db = require("./../db/lokijs");

function seedDb() {
  let testProjects = [];

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

  return testProjects;
}

beforeEach(done => {
  db.useDb("test-db");
  db
    .getCollection("project")
    .chain()
    .remove();
  done();
});

describe("Post /projects", () => {
  it("should create a new project", done => {
    var name = "test project";
    var date = "2017-10-09";
    request(app)
      .post("/projects")
      .send({ name, date })
      .expect(200)
      .expect(response => {
        expect(response.body.name).toBe(name);
        expect(response.body.date).toBe(date);
        expect(response.body.year).toBe(2017);
      })
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        expect(db.getCollection("project").find({ name }).length).toBe(1);
        done();
      });
  });

  it("should not create a new project without a name", done => {
    request(app)
      .post("/projects")
      .send()
      .expect(400)
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        expect(db.getCollection("project").find().length).toBe(0);
        done();
      });
  });

  it("should not create a new project with an invalid date", done => {
    var name = "test project";
    var date = "2017-02-29";
    request(app)
      .post("/projects")
      .send({ name, date })
      .expect(400)
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }
        expect(db.getCollection("project").find().length).toBe(0);
        done();
      });
  });
});

describe("Get /projects", () => {
  it("should return an empty list when there are no projects", done => {
    request(app)
      .get("/projects")
      .expect(200)
      .expect(response => {
        expect(response.body).toEqual([]);
      })
      .end(done);
  });

  it("should return all the projects", done => {
    let testProjects = seedDb();
    request(app)
      .get("/projects")
      .expect(200)
      .expect(response => {
        expect(response.body).toEqual(testProjects);
      })
      .end(done);
  });
});

describe("Get /projects/:id", () => {
  it("should return a 404 not found for when there is no projects with given id", done => {
    request(app)
      .get("/projects/0")
      .expect(404)
      .end(done);
  });

  it("should return the project with given id", done => {
    let testProjects = seedDb();

    request(app)
      .get("/projects/" + testProjects[1].id)
      .expect(200)
      .expect(response => {
        expect(response.body).toEqual(testProjects[1]);
      })
      .end(done);
  });

  it("should return an error for an invalid id", done => {
    request(app)
      .get("/projects/a")
      .expect(400)
      .end(done);
  });
});

describe("delete /projects/:id", () => {
  it("should return a 404 not found for when there is no project with given id", done => {
    request(app)
      .delete("/projects/0")
      .expect(404)
      .end(done);
  });

  it("should remove the project with given id", done => {
    let testProjects = seedDb();

    request(app)
      .delete("/projects/" + testProjects[1].id)
      .expect(200)
      .expect(response => {
        expect(response.body).toEqual({
          name: "test project 2",
          date: "1928-01-06",
          year: 1928,
          month: 01,
          day: 06
        });
      })
      .end((error, response) => {
        if (error) {
          done(error);
          return;
        }

        expect(db.getCollection("project").get(testProjects[1].id)).toBe(null);
        done();
      });
  });

  it("should return an error for an invalid id", done => {
    request(app)
      .delete("/projects/a")
      .expect(400)
      .end(done);
  });
});
