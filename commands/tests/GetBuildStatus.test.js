const GetBuildStatus = require("../buildStatus");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const pr_num = 1


const server = setupServer(
    rest.get(`${API}pr/${owner}/${repo}/${pr_num}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(
          {head: {sha: "1"}, user: {login: "Alice"}}
      ))}),
      rest.get(`${API}commit/${owner}/${repo}/1`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(
            [{description: "description of tests", created_at: "2020-04-2"}]
        ))})
    );  

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("returns pr build status", async() => {
    const content = await GetBuildStatus([pr_num],  repo, owner);

    expect(content).toBe("For PR 1, description of tests at 2020-4-2. It was created by Alice.");
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}pr/${owner}/${repo}/${pr_num}`, (req, res, ctx) => {
      return res(ctx.status(404))})
  );

  await expect(GetBuildStatus([pr_num], repo, owner)).rejects.toThrow("404");
});
