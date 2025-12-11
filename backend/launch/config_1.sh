#!/bin/bash
figlet -f slant "START BACK SERV"
echo "Status of the serv- $(date +%A), $(date +%B) $(date +%d)"
echo "----------------"
echo "System: $(uname -s) $(uname -r)"
echo ""
npm run start

