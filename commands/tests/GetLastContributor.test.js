const GetLastContributor = require("../lastContributor");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const file = "test.js"
const branch = "main"

const server = setupServer(
    rest.get(`${API}branch/${owner}/${repo}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(
            [{name: "main", commit: {sha: "1"}}]
        )
    )}),
    rest.get(`${API}repo/gitTree/${owner}/${repo}/1/1`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json( 
            {tree: [{path: "test.js", type: "blob"}]}
        )
    )}),
    rest.get(`${API}commit/path/${owner}/${repo}/${encodeURI(file)}`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json( 
            [{commit: {author: {name: "Alice"}}}]
        )
    )})
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("returns last contributor for a given file", async() => {
    const content = await GetLastContributor([file, branch], repo, owner);

    expect(content).toBe("The last contributor to test.js in the main branch was Alice.");
});


test("handles failure", async() => {
    server.use(
        rest.get(`${API}branch/${owner}/${repo}`, (req, res, ctx) => {
            return res(ctx.status(404))})
    );
  
    await expect(GetLastContributor([file, branch], repo, owner)).rejects.toThrow("404");
  });