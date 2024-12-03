#---------------------------------------
# Libraries and references
#---------------------------------------
#import pandas as pd
#import numpy
import json
import os
import codecs

#---------------------------------------
# [Required] Script information
#---------------------------------------
ScriptName = "Fact Command"
Website = "https://www.twitch.tv/Cyber_1"
Creator = "Cyber_1"
Version = "1.1"
Description = "Attempt at making a Fact command."

settingsFile = os.path.join(os.path.dirname(__file__), "settings.json")

#---------------------------------------
# Global Variables
#---------------------------------------
global command

command = "!fact"

class Settings:
    # Tries to load settings from file if given 
    # The 'default' variable names need to match UI_Config
    def __init__(self, settingsFile = None):
        if settingsFile is not None and os.path.isfile(settingsFile):
            with codecs.open(settingsFile, encoding='utf-8-sig',mode='r') as f:
                self.__dict__ = json.load(f, encoding='utf-8-sig')
        else: #set variables if no settings file
            self.api_key = ""
            self.Command = False
            

            
    # Reload settings on save through UI
    def ReloadSettings(self, data):
        self.__dict__ = json.loads(data, encoding='utf-8-sig')
        return

    # Save settings to files (json and js)
    def SaveSettings(self, settingsFile):
        with codecs.open(settingsFile,  encoding='utf-8-sig',mode='w+') as f:
            json.dump(self.__dict__, f, encoding='utf-8-sig')
        with codecs.open(settingsFile.replace("json", "js"), encoding='utf-8-sig',mode='w+') as f:
            f.write("var settings = {0};".format(json.dumps(self.__dict__, encoding='utf-8-sig')))
        return

#---------------------------
#   [Required] Initialize Data (Only called on load)
#---------------------------
def Init():
    global MySettings
    
    # Load in saved settings
    MySettings = Settings(settingsFile)
    return
    
def ReloadSettings(jsonData):
    # Globals
    global MySettings

    # Reload saved settings
    MySettings.ReloadSettings(jsonData)

    # End of ReloadSettings
    return
    
def UpdateSettings():
    with open(m_ConfigFile) as ConfigFile:
        MySettings.__dict__ = json.load(ConfigFile)
    return
 
def Execute(data):
    global command, ScriptName
    if not data.IsChatMessage():
        #Parent.AddUserCooldown(ScriptName, command, data.User)
        #Parent.AddCooldown(ScriptName, command)
         return
         
    #if !fact command was used and is enabled in the settings
    elif data.GetParam(0).lower() == command and MySettings.Command: 
        try:
            Fact = fetch_dataAPI()
            Parent.SendTwitchMessage(Fact)
        except:
            Parent.SendTwitchMessage("Error.")
            return
        
    
    return
    
#---------------------------
#   [Required] Tick method (Gets called during every iteration even when there is no incoming data)
#---------------------------
def Tick():
    return


#fetches the current wr holder from speedrun.com API based on the season_id        
def fetch_dataAPI():

    global ScriptName, MySettings
    
    if MySettings.api_key == "":
    # no api key was configured in the script settings
        return "Please Insert API Key."
        
    baseURL = "https://api.api-ninjas.com/v1/facts"
    # headers = {
     # {'Authorization': 'Bearer FDF7u89fdC998875c8d7f'}
     # }
    headers = {'X-Api-Key': MySettings.api_key}
    r = Parent.GetRequest(baseURL,headers)
    data = json.loads(r)#['data']
    
    data = json.loads(data['response'])
    json_temp = json.dumps(data)
    #Parent.Log(ScriptName, str(json_temp))
    temp = json.loads(json_temp)
    fact = temp[0]['fact']
    #Parent.Log(ScriptName, fact)
    return fact
    
    
def Parse(parseString, userid, username, targetid, targetname, message):
    if "$Fact" in parseString:
        return parseString.replace("$Fact",fetch_dataAPI())

    return parseString