Install stateless_timer package by usig:

npm i stateless_timer

Require package in your Project by:

const {Timer} = require('stateless_timer');

Call it constartustor use Redis Connection,Activemq Connection and queue_name as a perametar e.g:

const myobj =new Timer(redis_connection,amq_conection,"agent-manag6");

It hava differant funtions e.g:

For start a timer you can use start method:

start(id: string, delay: number, type: TimerType, data: any)
which hava id,delay, timerType ('CUSTOMER_INACTIVITY' etc),and any data it it may pass a null object 

For stop a timer you can use stop method:

stop(id: string, type: TimerType)
id and  timerType ('CUSTOMER_INACTIVITY' etc) is a perameter for it

For check status of timer you can use isRunning method:

isRunnig(id: string, type: TimerType)
id and  timerType ('CUSTOMER_INACTIVITY' etc) is a perameter for it
 it return a boolean value true if timer is still exist else false#   S t a t e l e s s - T i m e r  
 