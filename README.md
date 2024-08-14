# cloudfront-invalidate-action

[![GitHub Release](https://img.shields.io/github/v/release/koki-develop/cloudfront-invalidate-action)](https://github.com/koki-develop/cloudfront-invalidate-action/releases/latest)
[![CI](https://img.shields.io/github/actions/workflow/status/koki-develop/cloudfront-invalidate-action/ci.yml?branch=main&logo=github&style=flat&label=ci)](https://github.com/koki-develop/cloudfront-invalidate-action/actions/workflows/ci.yml)
[![Build](https://img.shields.io/github/actions/workflow/status/koki-develop/cloudfront-invalidate-action/build.yml?branch=main&logo=github&style=flat&label=build)](https://github.com/koki-develop/cloudfront-invalidate-action/actions/workflows/build.yml)

Create an invalidation for a CloudFront distribution.

## Usage

Specify a CloudFront distribution ID or alternative domain name to invalidate the cache.

```yaml
# Specify a CloudFront distribution ID
- uses: koki-develop/cloudfront-invalidate-action@v1
  with:
    id: E1234567890

# Specify an alternative domain name
- uses: koki-develop/cloudfront-invalidate-action@v1
  with:
    cname: www.example.com
```

### Inputs

| Name | Description |
| --- | --- |
| `id` | The ID of the distribution. |
| `cname` | Alternative domain name (CNAME) associated with the CloudFront distribution. |
| `paths` | The paths to be invalidated. You can specify multiple paths by separating them with a newline.<br/>The default is `/*`. |
| `caller-reference` | A value that you specify to uniquely identify an invalidation request. |
| `wait` | Wait for the Invalidation to complete.<br/>The default is `true`. |

### Outputs

| Name | Description |
| --- | --- |
| `invalidation-id` | The ID of the created invalidation. |

## LICENSE

[MIT](./LICENSE)
