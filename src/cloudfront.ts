import {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetInvalidationCommand,
  ListDistributionsCommand,
  type ListDistributionsCommandOutput,
} from "@aws-sdk/client-cloudfront";

const _client = new CloudFrontClient();

export const getDistributionIdByDomainName = async (
  domainName: string,
): Promise<string> => {
  let marker: string | undefined = undefined;
  do {
    const response: ListDistributionsCommandOutput = await _client.send(
      new ListDistributionsCommand({ Marker: marker }),
    );

    const distribution = response.DistributionList?.Items?.find(
      (item) => item.DomainName === domainName,
    );
    if (distribution) {
      // biome-ignore lint/style/noNonNullAssertion:
      return distribution.Id!;
    }
    marker = response.DistributionList?.NextMarker;
  } while (marker !== undefined);

  throw new Error(`Distribution not found for domain name: ${domainName}`);
};

export const createInvalidation = async (params: {
  distributionId: string;
  paths: string[];
  callerReference: string;
}): Promise<string> => {
  const response = await _client.send(
    new CreateInvalidationCommand({
      DistributionId: params.distributionId,
      InvalidationBatch: {
        CallerReference: params.callerReference,
        Paths: {
          Quantity: params.paths.length,
          Items: params.paths,
        },
      },
    }),
  );

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return response.Invalidation!.Id!;
};

export const waitForInvalidation = async (params: {
  distributionId: string;
  invalidationId: string;
}): Promise<void> => {
  while (true) {
    const response = await _client.send(
      new GetInvalidationCommand({
        DistributionId: params.distributionId,
        Id: params.invalidationId,
      }),
    );

    switch (response.Invalidation?.Status) {
      case "Completed":
        return;
      case "InProgress":
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        break;
      default:
        throw new Error(
          `Unexpected invalidation status: ${response.Invalidation?.Status}`,
        );
    }
  }
};
