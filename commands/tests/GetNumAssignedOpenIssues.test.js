const GetNumAssignedOpenIssues = require("../numAssignedOpenIssues");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const pageNum = 1

const server = setupServer(
    rest.get(`${API}issue/${owner}/${repo}/${pageNum}/100`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json( 
            {total_count: 2, items: [{assignee: "Alice"},
            {assignee: "Bob"}]}
        ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("returns number of assigned issues issue", async() => {
    const content = await GetNumAssignedOpenIssues([],  repo, owner);

    expect(content).toBe("There are 2 assigned, open issues in this repository");
});

test("there are no issues", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/${pageNum}/100`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(
                {total_count: 0, items: []}
            ))
        }));
    const content = await GetNumAssignedOpenIssues([],  repo, owner);

    expect(content).toBe("There are no issues in this repository");
});

test("handles failure", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/${pageNum}/100`, (req, res, ctx) => {
            return res(ctx.status(404))})
    );
  
    await expect(GetNumAssignedOpenIssues([],  repo, owner)).rejects.toThrow("404");
  });