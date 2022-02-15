/**
 * Calculator
 * @classdesc 中置記法の式から計算結果を出力する
 * @param {string} input 中置記法の数式
 */
class Calculator {
    constructor(input){
        this._infix_notation
        this.input = input
        // this._permission_input_regexp = /[\s\d.+-*/()=]/g
        this._number_regexp = /[\d+\.]/
        this._regexp_for_split = /\s*([\d\.]+|\*+|[+-/()=])\s*/
        this._symbols = {
            '(': 21,
            ')': 21,
            '**': 16,
            '*': 15,
            '/': 15,
            '%': 15,
            '+': 14,
            '-': 14,
            '=': 3
        }
        this._output = document.getElementById("output_answer")
    }

    /**
     * 結果を出力する
     * @param {string} str 
     */
    print(str) {
        this._output.textContent = str
    }

    /**
     * 結果出力欄の背景色を設定する
     * @param {boolean} isError 
     */
    color(isError = true) {
        if(isError) {
            this._output.classList.add("error")
        } else {
            this._output.classList.remove("error")
        }
    }

    /**
     * 配列が空かどうか判定
     * @param {Array} ary 配列 
     * @returns {boolean} 空ならtrue
     */
    isEmpty(ary = this.infix_notation) {
        if(ary.length == 0) {
            return true
        } else {
            return false
        }
    }

    // /**
    //  * 数式がエラーを起こすものでないか確認する
    //  * 演算子、数字以外の文字が含まれていないか
    //  * 数字が連続していたり、記号が連続していたりしていないか
    //  * 括弧が閉じているか
    //  * @returns {boolean} 
    //  */
    // isValidate(ary = this._infix_notation) {
    //     let is_pre_number = false
    //     let is_pre_unary = false
    //     let is_pre_start_group = false
    //     let is_pre_end_group = false
    //     let group_depth = 0
    //     for(const s of ary) {
    //         // console.log(s)
    //         if(this._get_priority(s) > 0) {
    //             if(this._get_priority(s) == 21) {
    //                 group_depth += this._is_group_symbol(s)
    //                 if(group_depth < 0) {
    //                     return false
    //                 }
    //                 if(this._is_group_symbol(s) > 0) {
    //                     if(is_pre_number) {
    //                         return false
    //                     }
    //                     is_pre_start_group = true
    //                 } else {
    //                     if(!is_pre_number && !is_pre_end_group) {
    //                         return false
    //                     }
    //                     is_pre_end_group = true
    //                 }
    //             } else {
    //                 if(!is_pre_number) {
    //                     if(this._get_priority(s) == 14) {
    //                         if(is_pre_unary) {
    //                             return false
    //                         } else {
    //                             is_pre_unary = true
    //                         }
    //                     } else {
    //                         return false
    //                     }
    //                 }
    //                 is_pre_number = false
    //                 is_pre_start_group = false
    //                 is_pre_end_group = false
    //             }
    //         } else if(!Number.isNaN(Number(s))) {
    //             if(is_pre_end_group) {
    //                 return false
    //             }
    //             if(is_pre_number) {
    //                 return false
    //             }
    //             is_pre_unary = false
    //             is_pre_number = true
    //             is_pre_start_group = false
    //             is_pre_end_group = false
    //         } else {
    //             return false
    //         }
    //     }
    //     if(group_depth != 0) {
    //         return false
    //     }
    //     return true
    // }

    /**
     * 中置記法の配列を取得
     * @returns {Array<string>} ex. ["1", "+", "1"]
     */
    get infix_notation() {
        if(!this._infix_notation) {
            this._infix_notation 
                = this.input.split(this._regexp_for_split)
                    .filter(Boolean)
        }
        return this._infix_notation
    }

    /**
     * 数字の部分を文字列から数字の型へ変更
     * @param {Array<string>} ary 検証済みの配列
     * @returns numberとstring混じりの配列
     */
    _to_number(ary = this.infix_notation) {
        return ary.map(str => {
            if(this._get_priority(str) == 0) {
                return Number(str)
            } else {
                return str
            }
        })
    }

    /**
     * 単項演算子を掛け算へ変換
     * @param {Array<int, string>} ary 検証済みの配列
     * @returns 単項演算子のない中置記法の配列
     */
    _unary_to_multi(ary = this._to_number()) {
        const res = []
        let is_pre_symbol = true
        for(const s of ary) {
            const priority = this._get_priority(s)
            if(priority > 0) {
                if(priority == 21) {
                    
                } else {
                    if(is_pre_symbol) {
                        if(s == '-') {
                            res.push(-1)
                            res.push('*')
                        }
                    }
                }
                is_pre_symbol = true
                res.push(s)
            } else {
                is_pre_symbol = false
                res.push(s)
            }
        }
        return res
    }

    /**
     * 演算子なら優先度を、それ以外なら0
     * @param {} chr 演算子かそれ以外
     * @returns {int}
     */
    _get_priority(chr) {
        if(chr in this._symbols) {
            return this._symbols[chr]
        } else {
            return 0
        }
    }

    /**
     * 括弧を含んだ数列を多次元配列として処理
     * @param {Array<string>} ary 中間置記法の配列
     * @returns {Array<string>} 多次元配列 ex. [[1,+,1],*,2]
     */
    groupInfixNotation(ary = this._unary_to_multi()) {
        console.log(ary)
        const res = []
        let depth = 0
        for(const s of ary) {
            if(this._is_group_symbol(s) < 0) {
                depth--
            } else {
                let target = res
                for(const _ in [...Array(depth).keys()]) {
                    target = target[target.length-1]
                }
                if(this._is_group_symbol(s) > 0) {
                    target.push([])
                    depth++
                } else {
                    target.push(s)
                }
            }
        }
        // console.log(res)
        return res
    }

    /**
     * 括弧の判定をする
     * 終わり括弧: -1
     * 始まり括弧: 1
     * それ以外: 0
     * @param {string} str 
     * @returns {int} +1, -1. 0
     */
    _is_group_symbol(str) {
        switch(str) {
            case ")":
                return -1;
            case "(":
                return 1;
        }
        return 0;
    }

    /**
     * 逆ポーランド記法に変換する
     * @param {Array<Number, str>} ary 中間値記法の配列
     * @returns {Array<Number, str>} 逆ポーランド記法の配列
     */
    shuntingYard(ary = this._to_number()) {
        const stack = new Stack()
        const rpn = new Queue()
        for(const token of ary) {
            const priority = this._get_priority(token)
            if(priority == 0) {
                rpn.enqueue(token)
            } else if(priority == 21) {
                if(this._is_group_symbol(token) > 0) {
                    stack.push(token)
                } else {
                    while(!stack.isEmpty()) {
                        const opr = stack.pop()
                        if(this._is_group_symbol(opr) == 0) {
                            rpn.enqueue(opr)
                        } else {
                            break
                        }
                    }
                    
                }
            } else {
                while(!stack.isEmpty() && this._get_priority(stack.peek()) >= priority && this._get_priority(stack.peek()) != 21) {
                    rpn.enqueue(stack.pop())
                }
                stack.push(token)
            }
        }
        while(!stack.isEmpty()) {
            rpn.enqueue(stack.pop())
        }
        return rpn
    }


    /**
     * 逆ポーランド記法の計算
     * @param {Array<Number, str>} rpn 逆ポーランド記法
     * @returns {Number} 演算結果
     */
    calcRpn(rpn = this.shuntingYard()) {
        const stack = new Stack()
        for(const token of rpn) {
            if(Number.isFinite(token)) {
                stack.push(token)
            } else {
                const right_num = stack.pop()
                const left_num = stack.isEmpty()
                    ? 0
                    : stack.pop()
                switch(token) {
                    case '+':
                        stack.push(left_num+right_num)
                        break
                    case '-':
                        stack.push(left_num-right_num)
                        break
                    case '*':
                        stack.push(left_num*right_num)
                        break
                    case '/':
                        stack.push(left_num/right_num)
                        break
                    case '%':
                        stack.push(left_num%right_num)
                        break
                    case '**':
                        stack.push(left_num**right_num)
                        break
                    case '=':
                        break
                    default:
                        throw Error("未知の記号が含まれています。")
                }
            }
        }
        console.log(stack)
        return stack[0]
    }

    /**
     * 計算結果の出力
     * @returns {string} 計算結果
     */
    run() {
        if(this.isEmpty()) {
            this.print("数式を入力してください。")
            return false
        }
        try{
            this.color(false)
            this.print(this.calcRpn())
        } catch(err) {
            this.print(err.message)
            this.color()
        }
    }
}

/**
 * @classdesc Arrayを継承したQueue
 */
class Stack extends Array {
    /**
     * 最後にpushした要素を参照する
     * @returns {} 最後にpushした要素
     */
    peek() {
        return this[this.length -1];
    }

    /**
     * スタックが空か判定する
     * @returns {boolean} 空ならばtrue
     */
    isEmpty() {
        return this.length < 1;
    }
}

/**
 * @classdesc Arrayを継承したQueue
 */
class Queue extends Array {
    /**
     * First-In
     * @param {} item キューに追加する要素
     */
    enqueue(item) {
        this.push(item);
    }

    /**
     * First-Out
     * @returns {} キューの先頭を取り出す
     */
    dequeue() {
        return this.shift();
    }

    /**
     * 最後に追加した要素を参照する
     * @returns {} 最後に追加した要素
     */
    peek() {
        return this[0];
    }

    /**
     * キューが空か判定する
     * @returns {boolean} 空ならばtrue
     */
    isEmpty() {
        return this.length === 0;
    }
}