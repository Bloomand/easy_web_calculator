import React, { useState } from 'react'
import { create, all} from 'mathjs'

//Позволяет использовать библиотеку через префикс math.
const config = { }
const math = create(all, config)

//Клавиши на клавиатуре
//  Вид: ["клавиша",переменная типа клавиши(0/1)]
//    1 - цифра, 0 - арифметическое действие
const numKeys = [["%",0], ["CE",0], ["C",0], ["←",0], ["1/x",0], ["x²",0], ["√x",0], ["÷",0], ["7",1], ["8",1], ["9",1], ["×",0], ["4",1], ["5",1], ["6",1], ["-",0], ["1",1], ["2",1], ["3",1], ["+",0], ["+/-",0], ["0",1], [".",0], ["=",0]];



export const MainPage = () => {
  const [flag, setFlag] = useState(0);//Флаг последнего элемента

  //Фраза - общее выражение, которое будет вычисляться
  //  Отображается маленьким шрифтом
  const [phrase, setPhrase] = useState("");

  //Число - последнее введенное число, добавляется к "фразе"
  //  Отображается большим шрифтом
  const [currentNum, setNum] = useState("");

  let listBut = [];//Позволит вывести все кнопки в виде div-массива, упростит отображение
  for(let i =0;i<numKeys.length;i++){
    let styleN = ''//Переменнная стиля, определяет какой стиль будем использовать для кнопки

    if(numKeys[i][0] == "="){//Обрабатываем "=" сразу, добавляя событие evaluatePhrase()
     listBut.push( <button className="buttonKey" value={numKeys[i][0]} onClick={() => evaluatePhrase()}><p className='textButton'>{numKeys[i][0]}</p></button>);
    }else{
      if(i<7 || i%4==3){//Меняем стиль в зависимотси от расположения кнопки
        styleN='buttonElse';
      }
      //На данном этапе кнопки делятся на два вида 
      //  Числовые и арифметические
      //События:
      //    Числовые - addNumber(значение клавиши), Арифметические - choiceArif(значение клавиши)
      if(numKeys[i][1] == "1"){
        listBut.push( <button className={styleN} value={numKeys[i][0]} onClick={() => addNumber(numKeys[i][0])}><p className='textButton'>{numKeys[i][0]}</p></button>);
      }else{
        listBut.push( <button className={styleN} value={numKeys[i][0]} onClick={() => choiceArif(numKeys[i][0])}><p className='textButton'>{numKeys[i][0]}</p></button>);
      }
    }
  }

  //----------- Этап всего функционала преобразования ----------------

  //Обработка нажатия на "="
  const evaluatePhrase = () => {
    setPhrase(phrase => phrase+currentNum);
    setNum("");
    setFlag(0);
    if(phrase!=""){//Проверяем не пустая ли строка для избежания вывода результата "undefined"
      if(flag==0){
        setPhrase(phrase => String(math.evaluate(phrase)));
      }
    }
  }

  //Добавление цифры
  const addNumber = (num) => {
    setNum(currentNum => currentNum+num);
    setFlag(0);//Сбрасываем флаг
  }

  //Выбор операции
  const choiceArif = (num) => {
    if(num=="C"){//Очистка текущего числа
      setNum("");
    }else if(num=="CE"){//Очистка всей фразы
      setPhrase("");
    }else if(num=="+/-"){//ПОложительное/Отрицательное число
      if(currentNum[0]=="-"){
        setNum(currentNum => "+"+currentNum.slice(1));//Обрезаем первый элемент (знак)
      }else if(currentNum[0]=="+"){
        setNum(currentNum => "-"+currentNum.slice(1));
      }else if(currentNum==""){
        setNum(currentNum => "-1");
      }else{
        setNum(currentNum => "-"+currentNum);
      }
    }else if(num=="←"){//Удаление последнего элемента из фразы
      setPhrase(phrase => phrase.slice(0, -1));
    }else if(num=="1/x"){//Дробь
      if(flag==1 || phrase==""){//Проверяем оканчивается ли на число
        if(currentNum==""){//Защита от пустого числа
          setPhrase(phrase => phrase+"(1/1)");
        }else{
          setPhrase(phrase => phrase+"(1/"+currentNum+")");
        }
        setNum("");
      }
    }else if(num=="x²"){//Возведение в квадрат
      if(currentNum==""){//Защита от пустого числа
        setPhrase(phrase => phrase+"(1*1)");
      }else{
        setPhrase(phrase => phrase+"("+currentNum+"*"+currentNum+")");
      }
      setNum("");
    }else if(num=="%"){//Процент
      if(flag==0 || phrase==""){
        if(currentNum==""){//Защита от пустого числа
          setPhrase(phrase => phrase+"100%");
        }else{
          setPhrase(phrase => phrase+currentNum+"%");
        }
        setNum("");
      }
    }else if(num=="√x"){//Корень из числа
      if(flag==1|| phrase==""){
        if(currentNum==""){//Защита от пустого числа
          setPhrase(phrase => phrase+"sqrt(1)");
        }else{
          setPhrase(phrase => phrase+"sqrt("+currentNum+")");
        }
        setNum("");
      }
    }else if(num=="+"){//Сложение
      if(flag==0){
        setPhrase(phrase => phrase+currentNum+num);
        setFlag(1);
        setNum("");
      }else if(flag==1){
        setPhrase(phrase => phrase.slice(0, -1)+currentNum+num);
        setNum("");
      }
    }else if(num=="-"){//Вычитание
      if(flag==0){
        setPhrase(phrase => phrase+currentNum+num);
        setFlag(1);
        setNum("");
      }else if(flag==1){
        setPhrase(phrase.slice(0, -1)+currentNum+num);
        setNum("");
      }
    }else if(num=="×"){//Умножение
      if(flag==0){
        setPhrase(phrase => phrase+currentNum+"*");
        setFlag(1);
        setNum("");
      }else if(flag==1){
        setPhrase(phrase => phrase.slice(0, -1)+currentNum+num);
        setNum("");
      }
    }else if(num=="÷"){//Деление
      if(flag==0){
        setPhrase(phrase => phrase+currentNum+"/");
        setFlag(1);
        setNum("");
      }else if(flag==1){
        setPhrase(phrase => phrase.slice(0, -1)+currentNum+num);
        setNum("");
      }
    }
  }
  

  //Скелет программы
  return (
    <div className='Content'>
        <div className='logo'></div>
        <p className='Title'>Standart</p>
        <p className='viewPhr'>{phrase}</p> 
        <div className='Screen'>{currentNum}</div>
        <div className='Item'>{listBut}</div>
    </div>
  )
}