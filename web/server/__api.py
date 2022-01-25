"""
  __api.py

    Backend API-queries
"""

import json
import requests
import threading
from time import time, sleep
from time import gmtime, strftime
import urllib, urllib.request

price = 0.0
supply = 0.0
staking = 0.0
parent_socket = None


def error_log(at, error):

    # Log an API error

    stamp = strftime("%Y-%m-%d %H:%M:%S - ", gmtime())

    with open("error_log.txt", "a+") as f:
        f.write('\n' + stamp + at + error)


def start_api_thread(obj):

    # A separate thread for API calls

    global parent_socket

    parent_socket = obj
    threading.Thread(target=API_calls).start()


def API_calls():

    # Time to implement API-queries
    # This is a separate thread that runs indefinitely on server

    global price
    global supply
    global staking 

    curr = 1
    now = 0.0
    last = -0.1
    query_limit = 60.0

    while True:
        
        # If we just booted our server, fetch the initial data every 10s (API-limit)
        # Otherwise fetch data every 1 minute, should be good enough
        if price == 0.0 \
        or supply == 0.0 \
        or staking == 0.0: query_limit = 10.0
        else: query_limit = 60.0

        now = time()
        elapsed = now - last

        # All chainz API-calls should be limited to 1->10 seconds
        if elapsed > query_limit:

            if curr == 1:
                # Get BLOCK - USD price

                curr += 1

                try:
                    price = json.load(urllib.request.urlopen("https://chainz.cryptoid.info/block/api.dws?q=ticker.usd"))
                except Exception as err:
                    error_log('[Price request]: ', err)

                print(' [#] Fetched price:', price)

            elif curr == 2:
                # Get Blocknet supply

                curr += 1

                try:
                    supply = json.load(urllib.request.urlopen("https://chainz.cryptoid.info/block/api.dws?q=circulating"))
                except Exception as err:
                    error_log('[Supply request]: ', err)

                print(' [#] Fetched supply:', supply)

            elif curr == 3:
                # Get total staking amount of the network

                curr = 1
                staking = 0.0

                try:
                    r = requests.get('https://chainz.cryptoid.info/explorer/index.stakes.dws?coin=block')
                except Exception as err:
                    error_log('[Staking request]: ', err)

                data = r.json()

                for x in data['stakes']: 
                    if x['amount']: staking += float(x['amount'])

            last = time()

            # Just some debugging, can remove
            print(' [#] Price:', price)
            print(' [#] Supply:', supply)
            print(' [#] Staking:', staking)

            # Send updated data to clients
            # Format our json data, round up some decimals
            x = {
                "price": str(round(price, 3)),
                "supply": str(round(supply, 3)),
                "staking": str(round(staking, 3))
            }

            json_response = json.dumps(x)

            # Echo the updated json back to client(s)
            parent_socket.emit('message', json_response)

        # Sleep the thread for a second
        sleep(1.0)
