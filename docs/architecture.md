# WellnessTern — proposed AWS architecture

WellnessTern uses AWS to read product documentation, maintain trusted product records with full version history, and deliver approved data to every channel.

## Request flow

1. Spec sheets
2. Amazon S3
3. Textract
4. Bedrock
5. DynamoDB
6. Product manager approval
7. Channel export

## Services

### Amazon Textract

**Role:** Read specifications and certificates

Extracts tables, key-value pairs and text from specification sheets and certificates, so product facts can be captured from any supplier format.

### Amazon Bedrock

**Role:** Normalise and compare

Maps supplier values to your attribute schema and summarises differences between product versions for approvers, with Guardrails keeping text factual and non-explicit.

### Amazon S3

**Role:** Store product documents

Keeps every specification, certificate and approved description encrypted and versioned — the evidence behind each product record.

### Amazon DynamoDB

**Role:** Hold product records and versions

Stores products, attributes, versions, completeness status and approvals with fast reads for catalogue browsing and exports.

### AWS Lambda

**Role:** Run checks and exports

Orchestrates extraction, runs completeness rules, compares revisions and generates channel exports on schedule.

## Principles

- **Approved data only** — Only approved versions are exported.
- **Full version history** — Every change is kept and attributable.
- **Factual language** — Descriptions stay factual and non-explicit.

## Safeguards

- **Product managers approve** — Every product version is approved by a person before export.
- **No certifications by AI** — WellnessTern tracks certificates you provide; it doesn’t certify safety or compliance.
- **Traceable changes** — Every attribute change links to its source document and approver.
- **Confidential specifications** — Product data is encrypted and shared only with channels you choose.

## MVP scope

Choose a product range. We extract and normalise specifications, compare current and previous revisions, run completeness checks, and deliver reviewed catalogue exports for one distributor or retailer.

- Specification upload and extraction
- Attribute normalisation
- Version comparison
- Completeness checks
- Reviewed catalogue export
