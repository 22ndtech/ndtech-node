#!/bin/bash
#
### BEGIN INIT INFO
# Provides:             apgv-server
# Required-Start:       $syslog $remote_fs
# Required-Stop:        $syslog $remote_fs
# Should-Start:         $local_fs
# Should-Stop:          $local_fs
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
# Short-Description:    APGV Server
# Description:          Server for the All Products Gone Viral family of web sites
### END INIT INFO
#
### BEGIN CHKCONFIG INFO
# chkconfig: 2345 55 25
# description: My Application
### END CHKCONFIG INFO
#
# An application name to display in echo text.
NAME="ndtech-node"
# The full path to the directory containing the node and forever binaries.
NODE_BIN_DIR="/usr/bin"
# Set the NODE_PATH to the Node.js main node_modules directory.
NODE_PATH="/usr/lib/node_modules"
# The application startup Javascript file path.
APPLICATION_PATH="/work/src/app.ts"
#The application working directory
APPLICATION_WORKING_DIR="/work"
# Process ID file path.
PIDFILE="/var/run/ndtech-node.pid"
# Log file path.
LOGFILE="/var/log/ndtech-node.log"
# Forever settings to prevent the application spinning if it fails on launch.
MIN_UPTIME="5000"
SPIN_SLEEP_TIME="2000"
# User to run forever script as
UID="ubuntu"
 
# Add node to the path for situations in which the environment is passed.
PATH=$NODE_BIN_DIR:$PATH
# Export all environment variables that must be visible for the Node.js
# application process forked by Forever. It will not see any of the other
# variables defined in this script.
export NODE_PATH=$NODE_PATH
export APP_SERVER_NAME=localhost
export APP_SERVER_PORT=80
export APP_SERVER_HTTPS=false
export APP_DB_PATH=mongodb://localhost/productsdb
export APPLICATION_WORKING_DIR="/work"
export AWS_ACCESS_KEY_ID=access-key-id
export AWS_SECRET_ACCESS_KEY=aws-secret-access-key

start() {
    echo "Starting $NAME"
    # The pidfile contains the child process pid, not the forever process pid.
    # We're only using it as a marker for whether or not the process is
    # running.
    #
    # Note that redirecting the output to /dev/null (or anywhere) is necessary
    # to make this script work if provisioning the service via Chef.
    forever \
      --pidFile $PIDFILE \
      --workingDir=$APPLICATIONS_WORKING_DIR \
      -a \
      -l $LOGFILE \
      --minUptime $MIN_UPTIME \
      --spinSleepTime $SPIN_SLEEP_TIME \
       start $APPLICATION_PATH 2>&1 > /dev/null &
#       start sudo -u $UID -H sh -c "$APPLICATION_PATH 2>&1 > /dev/null &"
#       start $APPLICATION_PATH 2>&1 > /dev/null &
#       start su ubuntu $APPLICATION_PATH 2>&1 > /dev/null &
    RETVAL=$?
}
 
stop() {
    if [ -f $PIDFILE ]; then
        echo "Shutting down $NAME"
        # Tell Forever to stop the process.
        forever stop $APPLICATION_PATH 2>&1 > /dev/null
        # Get rid of the pidfile, since Forever won't do that.
        rm -f $PIDFILE
        RETVAL=$?
    else
        echo "$NAME is not running."
        RETVAL=0
    fi
}
 
restart() {
    stop
    start
}
 
status() {
    # On Ubuntu this isn't even necessary. To find out whether the service is
    # running, use "service my-application status" which bypasses this script
    # entirely provided you used the service utility to start the process.
    #
    # The commented line below is the obvious way of checking whether or not a
    # process is currently running via Forever, but in recent Forever versions
    # when the service is started during Chef provisioning a dead pipe is left
    # behind somewhere and that causes an EPIPE exception to be thrown.
    # forever list | grep -q "$APPLICATION_PATH"
    #
    # So instead we add an extra layer of indirection with this to bypass that
    # issue.
    echo `forever list` | grep -q "$APPLICATION_PATH"
    if [ "$?" -eq "0" ]; then
        echo "$NAME is running."
        RETVAL=0
    else
        echo "$NAME is not running."
        RETVAL=3
    fi
}
 
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        restart
        ;;
    *)
        echo "Usage: {start|stop|status|restart}"
        exit 1
        ;;
esac
exit $RETVAL
