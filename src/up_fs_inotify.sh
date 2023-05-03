#!/bin/bash
echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf
echo fs.inotify.max_user_instances=512 | tee -a /etc/sysctl.conf 
sysctl --system