import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

function App(): React.JSX.Element {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [prevElapsedTime, setPrevElapsedTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [lapOrResetText, setLapOrResetText] = useState('Lap');
  const [evenStart, setEvenStart] = useState(false);
  let interval: NodeJS.Timeout;

  useEffect(() => {
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 0.1);
      }, 100);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartStop = () => {
    if (isRunning) {
      setLapOrResetText('Reset');
    } else {
      setLapOrResetText('Lap');
    }
    setEvenStart(true);
    setIsRunning(prevIsRunning => !prevIsRunning);
  };

  const handleLapOrReset = () => {
    if (isRunning) {
      handleRecordLap();
    } else {
      handleReset();
    }
    setLapOrResetText('Lap');
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setPrevElapsedTime(0);
    setLaps([]);
  };

  const handleRecordLap = () => {
    setLaps(prevLaps => [...prevLaps, elapsedTime - prevElapsedTime]);
    setPrevElapsedTime(elapsedTime);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, '0');
    const milliseconds = Math.floor((timeInSeconds * 100) % 100)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeWrapper}>
        <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableHighlight
          style={[styles.controlButton, styles.lapButton]}
          onPress={handleLapOrReset}>
          <Text style={styles.buttonText}>{lapOrResetText}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[
            styles.controlButton,
            isRunning ? styles.stopButton : styles.startButton,
          ]}
          onPress={handleStartStop}>
          <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </TouchableHighlight>
      </View>

      <View style={styles.lapsContainer}>
        {evenStart ? (
          <View style={styles.lap}>
            <Text style={{color: 'white'}}>Lap {laps.length + 1}:</Text>
            <Text style={{color: 'white'}}>{formatTime(elapsedTime-prevElapsedTime)}</Text>
          </View>
        ) : null}
        <View>
          {laps.map((lap, index) => (
            <View key={index} style={styles.lap}>
              <Text style={{color: 'white'}}>Lap {index + 1}:</Text>
              <Text style={{color: 'white'}}>{formatTime(lap)}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  timeWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  timer: {
    fontSize: 60,
    color: 'white',
  },
  controlButton: {
    borderWidth: 2,
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    margin: 20,
  },
  lapButton: {
    backgroundColor: 'gray',
  },
  resetButton: {
    color: 'gray',
  },
  startButton: {
    backgroundColor: 'green',
  },
  stopButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
  },
  lapsContainer: {
    flex: 6,
  },
  lap: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: 'black',
    padding: 10,
    margin: 10,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
});

export default App;
