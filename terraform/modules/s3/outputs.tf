output "s3_bucket_id" {
  description = "The name of the bucket"
  value       = aws_s3_bucket.main.id
}

output "s3_bucket_arn" {
  description = "The ARN of the bucket"
  value       = aws_s3_bucket.main.arn
}

output "s3_bucket_region" {
  description = "The AWS region the bucket resides in"
  value       = aws_s3_bucket.main.region
}

output "s3_bucket_domain_name" {
  description = "The bucket domain name"
  value       = aws_s3_bucket.main.bucket_domain_name
}