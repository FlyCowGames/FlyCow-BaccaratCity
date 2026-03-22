#!/bin/bash
# ============================================================
# Baccarat City — Kaizen Improvement Loop
# Thin wrapper that sets project config and sources the shared runner.
# ============================================================

export PROJECT_DIR="/home/ec2-user/GitHub/FlyCow-BaccaratCity"
export PROJECT_NAME="Baccarat City"
export S3_BUCKET="baccaratcity-site"
export CLOUDFRONT_ID="E3V8V12C6EPFK6"
export S3_GREP_MATCH="s3://baccaratcity"
export MAIN_FILE="src/index.html"
export MAIN_FILE_S3_KEY="index.html"
export AUDIT_INTERVAL="10"
export DOMAINS="rendering|atmosphere|animation|landmarks|events|interactivity|audio|infrastructure"

source /home/ec2-user/GitHub/kaizen/improve.sh
