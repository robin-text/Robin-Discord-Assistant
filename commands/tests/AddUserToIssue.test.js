const AddUserToIssue = require("../addUserToIssue");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const issue_num = 1337

const server = setupServer(
    rest.get(`${API}issue/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({
          "number": 1337,
          "assignees": [ {login: "Alice"}, {login: "Bob"}]
      }))}),
    rest.patch(`${API}issue/${owner}/${repo}/${issue_num}/update`, (req, res, ctx) => {
      return res(ctx.status(200))
    }));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("adds user to issue", async() => {
    const content = await AddUserToIssue(['John, Maggy', issue_num],  repo, owner);

    expect(content).toBe("Sucessfully added John, Maggy to 1337");
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}issue/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
      return res(ctx.status(404))}),
    rest.patch(`${API}issue/${owner}/${repo}/${issue_num}/update`, (req, res, ctx) => {
      return res(ctx.status(404))
    })
  );

  await expect(AddUserToIssue(['John, Danny', issue_num],  repo, owner)).rejects.toThrow("404");
});
