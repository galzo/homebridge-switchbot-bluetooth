<span align="center">

<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

# Homebridge SwitchBot Bluetooth Platform

<p>
    The Homebridge SwitchBot Bluetooth Platform is a <a href="https://github.com/homebridge/homebridge">Homebridge</a> plugin
    that allows you to directly control your <a href="https://www.switch-bot.com">SwitchBot</a> bot device from HomeKit 
    via BLE <a href="https://en.wikipedia.org/wiki/Bluetooth_Low_Energy">(Bluetooth Low Energy).</a><br>
    This plugin aims to provide the best performance and stability when controlling your SwitchBot bot via BLE. 
</p>

[![npm version](https://badgen.net/npm/v/homebridge-switchbot-bluetooth-platform)](https://www.npmjs.com/package/homebridge-switchbot-bluetooth-platform)
[![npm downloads](https://badgen.net/npm/dt/homebridge-switchbot-bluetooth-platform)](https://www.npmjs.com/package/homebridge-switchbot-bluetooth-platform)
[![latest commit](https://badgen.net/github/last-commit/galzo/homebridge-switchbot-bluetooth)](https://github.com/galzo/homebridge-switchbot-bluetooth)
[![paypal](https://img.shields.io/badge/Donate-PayPal-purple?logo=paypal&style=flat-square)](https://paypal.me/galzo1)

### Why do I need (yet another) SwitchBot plugin?

<p>
    The existing SwitchBot plugins did not provide the level of stability and feature-set that I was looking for.
</p>
<p>
    This plugin aims to provide the <b>best performance</b> (around <b>30% faster</b> BLE calls than other switchbot plugins), 
    and <b>best stabilty</b> (support for retry mechanism, error handling and device details caching), assuring you that the plugin 
    will stay <b>stable</b> upon usage, and the switchbot will respond <b>as fast as possible.</b> 
</p>
<p>
    This plugin also aims to provide several new features, such as support for bot <b>battery status</b>, and <b>password-protected BLE communication</b>.
</p>

</span>

## Supported Devices

Supported Devices:

- [SwitchBot (Bot)](https://www.switch-bot.com/products/switchbot-bot)

To Be Supported Soon:

- [SwitchBot Curtain (Curtain)](https://www.switch-bot.com/products/switchbot-curtain)
- [SwitchBot Thermometer & Hygrometer (Meter)](https://www.switch-bot.com/products/switchbot-meter)

## Installation

### Installing from Homebridge Plugins Page:

1. Search for "switchbot bluetooth"
2. Find `homebridge-switchbot-bluetooth-platform`
   - **NOTE:** Check noble [prerequisites](https://github.com/homebridge/noble#prerequisites) for your operating system. this is used for the bluetooth communcation.
3. Install the plugin

### Installing Directly:

1. Open Terminal
2. run command `npm install -g homebridge-switchbot-bluetooth-platform`
   - **NOTE:** Check noble [prerequisites](https://github.com/homebridge/noble#prerequisites) for your operating system. this is used for the bluetooth communcation.

## Configuration

Add a new platform to your homebridge `config.json` file

```json
"platforms": [
    {
        "platform": "SwitchBotBluetoothPlatform",
        "name": "SwitchBotBluetoothPlatform"
    }
]
```

under the new platform, add `devices` field

```json
"platforms": [
    {
        "platform": "SwitchBotBluetoothPlatform",
        "name": "SwitchBotBluetoothPlatform",
        "devices": [
            {
                "type": "bot",
                "name": "Bedroom Bot",
                "address": "a4:ee:45:10:fa:5d"
            },
            {
                "type": "bot",
                "name": "Living Room Bot",
                "address": "c1:fe:61:33:sd:4f",
                "scanDuration": 2000,
                "scanRetries": 7,
                "scanRetryCooldown:": 1000,
            }
        ]
    }
]
```

## Device Configuration Properties

Upon defining a device in the `devices` list, the following properties are available:

**Mandatory Properties**

- `name` - Device name. Must be unique (no duplications).
- `type` - Type of device. (currently only `bot` is supported).
- `address` - MAC Address of the SwitchBot device. [Learn how to find MAC Address](#finding-your-switchbot-mac-address).

**Optional Properties**

- `scanDuration` - Time for scanning bluetooth devices (in miliseconds).
  <br>A longer time will increase chance of successfuly detecting new devices, but reduce response time.
  <br>Default is `5000` (5000 miliseconds)

- `scanRetries` - The Number of times that the plugin should attempt scanning for SwitchBot device, before failing.
  <br>Default is `5` (5 attempts)

- `scanRetryCooldown` - Time for waiting between attempts of scanning / connecting to SwitchBot device.
  <br>Default is `1000` (1000 miliseconds)

- `autoTurnOffInPressMode` - Automatically Sets button back to OFF state when bot is configured to be in 'Press' mode (Enabled by default for bots that are set to 'Press' mode)
  <br>Default is `true` (enabled)

## Finding your SwitchBot MAC Address

1. Download SwitchBot App -
   <a href="https://apps.apple.com/us/app/switchbot/id1087374760"> iOS App Store </a> /
   <a href="https://play.google.com/store/apps/details?id=com.theswitchbot.switchbot&hl=en&gl=US">Google Play Store</a>
2. Register / or Login into your SwitchBot account
3. Open the device that you want to add to this platform
4. Click `Device Info`
5. Copy the `BLE MAC` address
6. Add the address to the `address` property of the device in the `config.json` file ([Your configuration](#configuration))

## Contact Me

For any questions, assistance or feedback feel free to contact me <a href="https://github.com/galzo">here</a>

## Buy Me a Coffee

If you want to buy me a coffee, you can do so here: https://paypal.me/galzo1 ♥️
