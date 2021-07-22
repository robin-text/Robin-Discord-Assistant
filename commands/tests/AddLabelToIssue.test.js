const AddLabelToIssue = require("../addLabelToIssue");
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
          "labels": [
            {
              "id": 2064120960,
              "node_id": "MDU6TGFiZWwyMDY0MTIwOTYw",
              "url": "https://api.github.com/repos/test",
              "name": "testLabel",
              "color": "d69f46",
              "default": false,
              "description": ""
            }
          ]
      }))}),
    rest.patch(`${API}issue/${owner}/${repo}/${issue_num}/update`, (req, res, ctx) => {
      return res(ctx.status(200))
    }));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("adds label to issue", async() => {
    const content = await AddLabelToIssue(['bug, P1', issue_num],  repo, owner);

    expect(content).toBe("Sucessfully added bug, P1 to 1337");
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}issue/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
      return res(ctx.status(404))}),
    rest.patch(`${API}issue/${owner}/${repo}/${issue_num}/update`, (req, res, ctx) => {
      return res(ctx.status(404))
    })
  );

  await expect(AddLabelToIssue(['bug, P1', issue_num],  repo, owner)).rejects.toThrow("404");
});
