After deploying to AWS Lambda, create a Cloudfront in order to ignore the /<Stage> path.

Origins setting:
Origin Domain will be the Lambda path excluding the <Stage> ie Prod

Origin path:
/<Stage> ie /Prod