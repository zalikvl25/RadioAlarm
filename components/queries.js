const create_table_alarms =
  'CREATE TABLE IF NOT EXISTS alarmClocks (id INTEGER PRIMARY KEY, description TEXT, timering INT, onoff INT, music TEXT);';

const insert_alarm =
  'INSERT INTO alarmClocks (id, description, timering, onoff, music) VALUES (?, ?, ?, ?, ? )';

const select_alarm =
  'SELECT id, description, timering, onoff, music FROM alarmClocks ORDER BY timering';

const delete_alarm = 'DELETE FROM alarmClocks WHERE id = ?';

const update_alarm =
  'Update alarmClocks SET (description, timering, onoff, music) = (?, ?, ?, ?) WHERE id = ?';

const retrive_alarm_clock = 'SELECT max(id) AS id FROM alarmClocks';

const update_alarm_status = 'Update alarmClocks SET(onoff) = (?) WHERE id = ?';

export {
  create_table_alarms,
  insert_alarm,
  select_alarm,
  update_alarm,
  update_alarm_status,
  delete_alarm,
  retrive_alarm_clock,
};
