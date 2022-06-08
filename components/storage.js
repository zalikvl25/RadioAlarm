import {
  create_table_alarms,
  delete_alarm,
  insert_alarm,
  retrive_alarm_clock,
  select_alarm,
  update_alarm,
  update_alarm_status,
} from './queries';

const createAlarmsTable = db => {
    db.transaction(txn => {
        txn.executeSql(
            create_table_alarms,
            [],
            () => {
                console.log('Таблица alarms успешно создана');
            },
            error => {
                console.log('Ошибка при создании таблицы alarms' + error.message);
            },
        );
    });
};

const retrieveAlarmsClocks = (db, setAlarmClocks) => {
    db.transaction(txn => {
    txn.executeSql(
        select_alarm,
        [],
        (sqlTxn, res) => {
        let results = [];
        if (res.rows.length > 0) {
            for (let i = 0; i < res.rows.length; i++) {
            let item = res.rows.item(i);
            results.push({
                id: item.id,
                description: item.description,
                timering: item.timering,
                onoff: item.onoff,
                music: item.music,
            });
            }
        }
        setAlarmClocks(results);
        let alarmsStates = [];
        for (var i = 0; i < results.length; i++) {
            alarmsStates.push(results[i].status);
        }
        console.log('Будильники получены успешно');
        },
        error => {
        console.log('Ошибка при получении будильников: ' + error.message);
        },
    );
    });
};

const deleteAlarmClock = (db, id, setAlarmClocks) => {
    db.transaction(txn => {
        txn.executeSql(
            delete_alarm,
            [id],
            () => {
                retrieveAlarmsClocks(db, setAlarmClocks);
                console.log(`Будильник удален успешно`);
            },
            error => {
                console.log('Ошибка при удалении будильника' + error.message);
            },
        );
    });
};

const addAlarmClock = (
    db,
    alarmClockID,
    description,
    alarmClockOnOff,
    timering,
    alarmClockRadio,) => {
        db.transaction(txn => {
            txn.executeSql(
                insert_alarm,
                [alarmClockID, description, alarmClockOnOff, timering, alarmClockRadio],
                () => {
                    console.log(`Будильник сохранен успешно`);
                },
                error => {
                    console.log('Ошибка при добавлении будльника ' + error.message);
                },
            );
        });
};

const updateAlarmClock = (
    db,
    alarmClockID,
    description,
    alarmClockOnOff,
    timering,
    alarmClockRadio,) => {
    db.transaction(txn => {
        txn.executeSql(
            update_alarm,
            [description, timering, alarmClockOnOff, alarmClockRadio, alarmClockID],
            () => {
                console.log(`Будильник обновлен успешно`);
            },
            error => {
                console.log('Ошибка при обновлении будльника ' + error.message);
            },
        );
    });
};

const updateAlarmStatus = (db, alarmClockID, onoff) => {
    db.transaction(txn => {
        txn.executeSql(
            update_alarm_status,
            [onoff, alarmClockID],
            () => {
                console.log(`Будильник обновлен успешно`);
            },
            error => {
                console.log('Ошибка при обновлении будльника ' + error.message);
            },
        );
    });
};

const retriveNewAlarmClockID = (db, setAlarmClockID) => {
    db.transaction(txn => {
        txn.executeSql(retrive_alarm_clock, [], (sqlTxn, res) => {
            let len = res.rows.length;
            let item = 0;
            if (len > 0) {
            for (let i = 0; i < len; i++) {
                item = res.rows.item(i).id + 1;
            }
            }
            setAlarmClockID(item);
        });
    });
};

export {
  createAlarmsTable,
  retrieveAlarmsClocks,
  retriveNewAlarmClockID,
  addAlarmClock,
  updateAlarmClock,
  updateAlarmStatus,
  deleteAlarmClock,
};
