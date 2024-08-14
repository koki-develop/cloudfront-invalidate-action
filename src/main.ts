import * as core from "@actions/core";
import {
  createInvalidation,
  getDistributionIdByDomainName,
  waitForInvalidation,
} from "./cloudfront";

const _randomCallerReference = () => {
  return `github-actions-${Math.random()
    .toString(36)
    .substring(2, 15)}-${new Date().getTime()}`;
};

export const main = async () => {
  try {
    const inputs = {
      id: core.getInput("id"),
      domainName: core.getInput("domain-name"),
      paths: core.getInput("paths").trim().split("\n"),
      callerReference:
        core.getInput("caller-reference") || _randomCallerReference(),
      wait: core.getInput("wait") === "true",
    } as const;
    if (inputs.id === "" && inputs.domainName === "") {
      throw new Error("`id` or `domain-name` is required");
    }

    const distributionId =
      inputs.id || (await getDistributionIdByDomainName(inputs.domainName));
    const invalidationId = await createInvalidation({
      distributionId,
      paths: inputs.paths,
      callerReference: inputs.callerReference,
    });
    core.setOutput("invalidation-id", invalidationId);
    core.startGroup("Invalidation created");
    core.info(`Distribution ID: ${distributionId}`);
    core.info(`Invalidation ID: ${invalidationId}`);
    core.endGroup();

    if (inputs.wait) {
      core.info("Waiting for invalidation to complete");
      await waitForInvalidation({ distributionId, invalidationId });
      core.info("Invalidation completed");
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      throw error;
    }
  }
};

await main();
