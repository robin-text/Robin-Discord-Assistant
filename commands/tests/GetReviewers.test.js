const GetReviewers = require("../reviewers");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const issue_num = 1337

const server = setupServer(
    rest.get(`${API}PR/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json( 
            [{user : {login: 'Alice'}, state: "APPROVED"}, 
            {user : {login: 'Bob'}, state: "APPROVED"}]
        ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("returns approval names", async() => {
    const content = await GetReviewers([issue_num],  repo, owner);

    expect(content).toBe("\nThe users who have approved this pull request are Alice, Bob\n");
});

test("returns requested changes name", async() => {
    server.use(
        rest.get(`${API}PR/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json( 
                  [{user : {login: 'Alice'}, state: "REQUEST_CHANGES"}, 
                  {user : {login: 'Bob'}, state: "REQUEST_CHANGES"}]
              ))}));
    const content = await GetReviewers([issue_num],  repo, owner);

    expect(content).toBe("\nThe users who have requested changes for this pull request are Alice, Bob\n");
});

test("returns approval and requested changes name", async() => {
    server.use(
        rest.get(`${API}PR/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json( 
                  [{user : {login: 'Alice'}, state: "APPROVED"}, 
                  {user : {login: 'Bob'}, state: "REQUEST_CHANGES"}]
              ))}));
    const content = await GetReviewers([issue_num],  repo, owner);

    expect(content).toBe("\nThe users who have approved this pull request are Alice\n\nThe users who have requested changes for this pull request are Bob\n");
});

test("returns no one", async() => {
    server.use(
        rest.get(`${API}PR/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json( 
                  []
              ))}));
    const content = await GetReviewers([issue_num],  repo, owner);

    expect(content).toBe("\nNo one has reviewed this pull request.\n");
});

test("handles failure", async() => {
    server.use(
        rest.get(`${API}PR/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
            return res(ctx.status(404))})
    );
  
    await expect(GetReviewers([issue_num],  repo, owner)).rejects.toThrow("404");
  });