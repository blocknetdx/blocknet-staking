"""
  __api.py

    Backend API-queries
"""

import json
import requests
import threading
from time import time, sleep
import urllib, urllib.request

price = 0.0
supply = 0.0
staking = 0.0



def start_api_thread():
    # A separate thread for API calls
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

        # Update data if it hasn't been updated last x seconds
        # All chainz API-calls should be limited to 1->10 seconds
        if elapsed > query_limit:

            if curr == 1:
                # Get BLOCK - USD price

                curr += 1
                price = json.load(urllib.request.urlopen("https://chainz.cryptoid.info/block/api.dws?q=ticker.usd"))
                print(' [#] Fetched price:', price)

            elif curr == 2:
                # Get Blocknet supply

                curr += 1
                supply = json.load(urllib.request.urlopen("https://chainz.cryptoid.info/block/api.dws?q=circulating"))
                print(' [#] Fetched supply:', supply)

            elif curr == 3:
                # Get total staking amount of Blocknet

                curr = 1
                staking = 0.0

                r = requests.get('https://chainz.cryptoid.info/explorer/index.stakes.dws?coin=block')
                data = r.json()

                for x in data['stakes']: staking += float(x['amount'])
                print(' [#] Fetched staking amount:', staking)

            last = time()
            print(' [#] Price:', price)
            print(' [#] Supply:', supply)
            print(' [#] Staking:', staking)

        # Sleep the thread for a second
        sleep(1.0)
