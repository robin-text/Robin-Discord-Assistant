const GetOldestIssue = require("../oldestIssue");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const issue_num = 1337

const server = setupServer(
    rest.get(`${API}issue/${owner}/${repo}/1/100`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json( 
            {items: [{title: "issue2", user : {login: 'Bob'}, created_at: "2020-04-19", number: 2},
            {title: "issue1", user : {login: 'Alice'}, created_at: "2020-03-19", number: 1}]}
        ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("returns oldest issue", async() => {
    const content = await GetOldestIssue([],  repo, owner);

    expect(content).toBe("The oldest issue was created on March 19, 2020 by Alice with title issue1 and number 1");
});

test("returns oldest issue", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/1/100`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(
                {items: []}
            ))
        }));
    const content = await GetOldestIssue([],  repo, owner);

    expect(content).toBe("There are no issues in this repository");
});

test("handles failure", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/1/100`, (req, res, ctx) => {
            return res(ctx.status(404))})
    );
  
    await expect(GetOldestIssue([issue_num],  repo, owner)).rejects.toThrow("404");
  });