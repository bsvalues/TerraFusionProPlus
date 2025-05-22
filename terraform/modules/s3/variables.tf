variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "force_destroy" {
  description = "A boolean that indicates all objects should be deleted from the bucket so that the bucket can be destroyed without error"
  type        = bool
  default     = false
}

variable "versioning" {
  description = "Map containing versioning configuration"
  type        = object({
    enabled = bool
  })
  default = {
    enabled = false
  }
}

variable "server_side_encryption_configuration" {
  description = "Map containing server-side encryption configuration"
  type        = object({
    rule = object({
      apply_server_side_encryption_by_default = object({
        sse_algorithm = string
      })
    })
  })
  default = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}