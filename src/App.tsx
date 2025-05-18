import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputText";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function App() {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [todolists, setTodolists] = useState<Todo[]>([]);
  const [value, setValue] = useState<string>("");
  const [valueEdit, setValueEdit] = useState<string>("");
  const [idEdit, setIdEdit] = useState<number>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    if (firstLoad) {
      const savedTodolists = localStorage.getItem("todolists");
      if (savedTodolists) {
        const oldTodolists = JSON.parse(savedTodolists);
        setTodolists(oldTodolists);
      }
      setFirstLoad(false);
    } else {
      localStorage.setItem("todolists", JSON.stringify(todolists));
    }
  }, [todolists]);

  const addTodo = () => {
    if (value === "") {
      return;
    }

    const id = todolists.length > 0 ? todolists[0].id + 1 : 1;
    const newTodo: Todo = {
      id,
      text: value,
      done: false,
    };
    setTodolists([newTodo, ...todolists]);
    setValue("");
  };

  const removeTodo = (id: number) => {
    setTodolists(todolists.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodolists(
      todolists.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const editTodo = (todo: Todo) => {
    setOpenDialog(true);
    setValueEdit(todo.text);
    setIdEdit(todo.id);
  };

  const updateTodo = () => {
    setTodolists(
      todolists.map((todo) =>
        todo.id === idEdit ? { ...todo, text: valueEdit } : todo
      )
    );
    setOpenDialog(false);
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4 col-start-2 p-4">
          <h1 className="text-xl">Todo List</h1>

          <div className="p-inputgroup flex-1">
            <InputText
              placeholder="..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              className="p-button-primary"
              label="เพิ่ม"
              severity="success"
              disabled={value === ""}
              onClick={() => addTodo()}
            />
          </div>

          {todolists.map((todo) => (
            <div
              key={todo.id}
              className="mt-4 grid grid-cols-12 gap-4 border border-gray-200 rounded-md p-2"
            >
              <div className="col-span-9 flex items-center">
                <Checkbox
                  onChange={() => toggleTodo(todo.id)}
                  checked={todo.done}
                />
                <div className="ml-2">{todo.text}</div>
              </div>
              <div className="col-span-3 flex justify-end">
                <Button
                  label="แก้ไข"
                  severity="warning"
                  onClick={() => editTodo(todo)}
                />
                <Button
                  label="ลบ"
                  severity="danger"
                  onClick={() => removeTodo(todo.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        header="แก้ไข"
        visible={openDialog}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!openDialog) return;
          setOpenDialog(false);
        }}
      >
        <div className="p-inputgroup flex-1">
          <InputText
            className="w-full"
            value={valueEdit}
            onChange={(e) => setValueEdit(e.target.value)}
          />
          <Button
            className="p-button-primary"
            label="บันทึก"
            severity="success"
            disabled={valueEdit === ""}
            onClick={() => updateTodo()}
          />
        </div>
      </Dialog>
    </>
  );
}

export default App;
