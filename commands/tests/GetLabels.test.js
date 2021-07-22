// 4 test cases
// 1 for approvals
// 1 for changes
// 1 for both
// 1 for none
// 1 for 404
const GetLabels = require("../labels");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"

const server = setupServer(
    rest.get(`${API}repo/labels/${owner}/${repo}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json( 
            [{name: 'label1'}]
        ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("returns the only label", async() => {
    const content = await GetLabels([], repo, owner);

    expect(content).toBe("The available labels in this repository are label1.");
});

test("returns 2 labels", async() => {
    server.use(
        rest.get(`${API}repo/labels/${owner}/${repo}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json( 
                [{name: 'label1'},
                {name: 'label2'}]
              ))}));
    const content = await GetLabels([], repo, owner);

    expect(content).toBe("The available labels in this repository are label1 and label2.");
});

test("returns more than 2 labels", async() => {
    server.use(
        rest.get(`${API}repo/labels/${owner}/${repo}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json( 
                [{name: 'label1'},
                {name: 'label2'},
                {name: 'label3'}]
              ))}));
    const content = await GetLabels([], repo, owner);

    expect(content).toBe("The available labels in this repository are label1, label2 and label3.");
});

test("returns 0 labels", async() => {
    server.use(
        rest.get(`${API}repo/labels/${owner}/${repo}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json( 
                []
              ))}));
    const content = await GetLabels([], repo, owner);

    expect(content).toBe("There are no available labels in this repository.");
});

test("handles failure", async() => {
    server.use(
        rest.get(`${API}repo/labels/${owner}/${repo}`, (req, res, ctx) => {
            return res(ctx.status(404))})
    );
  
    await expect(GetLabels([], repo, owner)).rejects.toThrow("404");
  });
