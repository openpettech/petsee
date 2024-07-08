# Petsee

⚠️ **Important Notice**: Petsee is currently in alpha. Features may change, and stability is not guaranteed. We welcome community feedback to shape the future of this project!

Petsee is an open-source REST API framework designed for pettech projects, offering a comprehensive suite of features for managing various aspects of pet-related businesses and services.

## 🚀 Features

### Core Entities

- **Customer Management**: Handle customer data and additional contact persons
- **Animal Management**: Manage animals with support for multiple ownership relationships
- **Organization Structure**:
  - Facility → Merchant → Group hierarchy
  - Person entity for staff and other individuals
- **Inventory Management**:
  - Entities: Brand, Supplier, Product, Warehouse, Stock, Stock Ledgers
- **Notes System**: Create and manage notes for customers and animals
- **Task System**: Create and manage tasks for people
- **Service Management**:
  - Basic service creation
  - Value override capabilities (Group, Merchant, Facility, Customer, Animal, Breed, Species, Person)
- **Tagging System**: Apply and manage tags for Animals and Customers
- **Resource Management**: Manage different kind of resources like rooms, hardware
- **Custom Fields**: Extend entity information with custom fields (see details below)
- **Document Management**:
  - Document template creation
  - Document creation based on templates

### Data Management

- **Translatable Dictionaries**: Support for species, breeds, blood groups, allergens, diagnoses, reference categories, and values
- **File Storage**: Integrated file management system

### Developer Tools

- **Project Management**: Create and manage multiple projects
- **API Key Generation**: Secure API access management
- **Webhook Support**: Create and manage webhooks
- **Webhook Logging**: Comprehensive logging for webhook activities

### Data Integrity

- **Data Lake**: Track changes and modifications across all entities

### Communication

- **Notification Center**: Manage communication channels
- **SMS**: Send and track sms messages

## 🧩 Modular Architecture

Petsee is built with modularity in mind, allowing easy adaptation and extension of core functionalities.

### Object Storage

- Current support: Minio
- Default: Minio
- Coming soon: S3 support
- Extensible: Create custom adapters for other storage solutions

### Search Engine

- Current support: Meilisearch
- Default: Meilisearch
- Optional: Can be disabled if not needed
- Extensible: Implement adapters for other search engines

### Authentication

- Default: Auth0
- Future plans: Support for additional authentication providers

### SMS

- Current support: Twilio
- Default: Twilio
- Extensible: Implement adapters for other search engines

## 🔧 Custom Fields

Petsee supports the addition of custom fields to extend information for various entities, providing flexibility and customization options for different use cases.

### Supported Entities for Custom Fields:

- Customer
- Animal
- Facility
- Merchant
- Group
- Person
- Notification Center

### Custom Field Capabilities:

- Add extra attributes to entities beyond the standard fields
- Support for various data types (e.g., text, number, date, boolean)
- Searchable and filterable

### Use Cases:

- Add breed-specific health indicators for animals
- Include loyalty program information for customers
- Track facility-specific certifications or specializations
- Store custom merchant categories or business types
- Add group-wide policy or procedure references
- Include person-specific skills or qualifications
- Custom notification types to manage

Custom fields provide the flexibility to tailor the Petsee platform to specific business needs without modifying the core data structure.

## 🚧 Alpha Status and Community Input

Petsee is currently in its alpha stage of development. This means:

- The API and features are subject to change
- Stability is not guaranteed, and breaking changes may occur
- Documentation may be incomplete or change frequently

We're actively seeking input from the pettech community to ensure Petsee meets real-world needs and enables faster development of innovative solutions. Your feedback is crucial in shaping the future of this project.

### How You Can Help:

- Try out Petsee and report any bugs or issues
- Suggest features or improvements that would benefit your pettech projects
- Share your use cases to help us understand diverse industry needs
- Contribute to discussions on architecture and API design
- Participate in our community forums or GitHub discussions

Your insights will help us refine Petsee, making it a robust foundation for a wide range of pettech applications. Together, we can build a tool that accelerates innovation in the pet care industry.

## 🛠️ Getting Started

### Required

- Docker
- Node 20

### Running the app

1. Install dependencies

```bash
yarn
```

2. Set up environment variables

```bash
cp .env.example .env
```

3. Setup docker containers

```bash
yarn docker:dev
```

4. Run db migrations

```bash
yarn prisma:migrate
```

5. Run db migrseedations

```bash
yarn prisma:seed
```

6. Run dev

```bash
yarn start:debug
```

### Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov

# test supertest
$ yarn test:supertest
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📄 License

Disclaimer: Everything you see here is open and free to use as long as you comply with the [license](LICENSE). I promise to do my best to fix bugs and improve the code.

#### Crafted with ❤️ by Pet Lovers
