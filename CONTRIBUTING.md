# Contribute to Structurify

Structurify is an open-source project administered by [Paelynn](<[pauline@petsee.co](https://github.com/Paelynn)>). I appreciate your interest and efforts to contribute to Petsee. See the [LICENSE](https://github.com/petsee-co/petsee/blob/main/LICENSE) licensing information. All work done is available on GitHub.

I highly appreciate your effort to contribute, but I recommend you talk to me before spending a lot of time making a pull request that may not align with the project roadmap. Whether it is from Structurify or contributors, every pull request goes through the same process.

## Code of Conduct

This project, and everyone participating in it, are governed by the [Petsee Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold it. Make sure to read the [full text](CODE_OF_CONDUCT.md) to understand which type of actions may or may not be tolerated.

## Bugs

Strapi is using [GitHub issues](https://github.com/petsee-co/petsee/issues) to manage bugs. We keep a close eye on them. Before filing a new issue, try to ensure your problem does not already exist.

---

## Before Submitting a Pull Request

The Structurify core team will review your pull request and either merge it, request changes, or close it.

# Contribution Prerequisites

- You have [Node.js](https://nodejs.org/en/) at version >= v20 and [Yarn](https://yarnpkg.com/en/) at v1.2.0+ installed.
- You are familiar with [Git](https://git-scm.com).
- You have [Docker](https://www.docker.com/) installed.

**Before submitting your pull request** make sure the following requirements are fulfilled:

- Fork the repository and create your new branch from `main`.
- Run `yarn install` in the root of the repository.
- Run `yarn setup` in the root of the repository.
- If you've fixed a bug or added code that should be tested, please make sure to add tests
- Ensure the following test suites are passing:
  - `yarn test`
  - `yarn test:e2e`
- Make sure your code lints by running `yarn lint`.
- If your contribution fixes an existing issue, please make sure to link it in your pull request.

## Development Workflow

### 1. Fork the [repository](https://github.com/petsee-co/petsee)

[Go to the repository](https://github.com/petsee-co/petsee) and fork it using your own GitHub account.

### 2. Clone your repository

```bash
git clone git@github.com:YOUR_USERNAME/petsee.git
```

### 3. Install the dependencies

Go to the root of the repository and run the setup:

```bash
# OSX/Linux
cd petsee
yarn install
yarn docker:dev
yarn setup
```

### 4. Start the api

```bash
yarn start:debug
```

The Swagger Docs should now be available at http://localhost:4000/docs.

**Awesome! You are now able to contribute to Petsee.**
