/**
 *   @author Marshall, Lee (marshalll@student.ncmich.edu)
 *   @version 0.0.1
 *   @summary
 *   @todo Nothing
 */

"use strict";

const PROMPT = require('readline-sync');

const MAX_TRANSACTION = 1000;
const MIN_TRANSACTION = .01;
const MIN_BALANCE = 0;
const MAX_ATTEMPT = 3;

let stringAcctIn, stringAcctOut, userName;//string

let action, checkOrSave, skip, requestAmount, inputAcct, acctIndexNum, inputPin, pinIndexNum, verify;//int
let verified = 0;
let savings = 1000;
let checking = 1000;

let arrAcctNums = [12345678, 23456789, 34567890, 45678901, 56789012, 67890123, 78901234, 89012345, 90123456];
let arrPinNums = [1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888, 9999];


/**
 * @method
 * @desc
 * @returns{null}
 */
function main() {
    while (verified !== 1) {
        setName();
        setEnterAcctNum();
        setEnterPin();
    }
    while (verified === 1) {
        chooseAction();
        branchAction();
    }
}

main();

/**
 * @method
 * @desc
 * @returns{method}
 */
function chooseAction() {
    const MAX_ACTION = 5;
    const MIN_ACTION = 1;

    while (action == null || action > MAX_ACTION || action < MIN_ACTION || !/[0-9]/.test(action)) {
        console.log(`\nWhat type of transaction would you like to make?`);
        console.log(`For balance inquiry [1]`);
        console.log(`To make a withdrawal [2]`);
        console.log(`To make a deposit [3]`);
        console.log(`To transfer funds [4]`);
        console.log(`To end this transaction [5]`);
        action = Number(PROMPT.question(`Please enter the appropriate value [1-5]: `));
        if (action == null || action > MAX_ACTION || action < MIN_ACTION || !/[0-9]/.test(action)) {
            console.log(`\x1Bc`);
            console.log(`not a valid option, please try again.`);
        }
    }
}

/**
 * @method
 * @desc
 * @returns{method}
 */
function branchAction() {
    switch (action) {
        case 1:
            console.log(`\x1Bc`);
            doInquire();
            break;
        case 2:
            doWithdrawal();
            break;
        case 3:
            doDeposit();
            break;
        case 4:
            doTransfer();
            break;
        case 5:
            verified = 0;
            break;
        default:
            return branchAction();
    }
}


/**
 * @method
 * @desc
 * @returns{method}
 */
function doDeposit() {
    console.log(`\x1Bc`);
    console.log(`\nWould you like to deposit into savings or checking? `);
    setCheckOrSaving();
    console.log(`\x1Bc`);
    requestAmount = null;
    while (requestAmount === null || requestAmount > MAX_TRANSACTION || requestAmount < MIN_TRANSACTION || !/[0-9]/.test(requestAmount)) {
        requestAmount = Number(PROMPT.question(`How much would you like to deposit into ` + stringAcctIn + `? `));
        if (requestAmount === null || requestAmount > MAX_TRANSACTION || requestAmount < MIN_TRANSACTION || !/[0-9]/.test(requestAmount)) {
            console.log(`not a valid option, please try again.`);
        }
    }
    if (checkOrSave === 1) {
        savings += requestAmount;
    }
    else {
        checking += requestAmount;
    }
    console.log(`\x1Bc`);
    console.log(`You have deposited $` + requestAmount + ` into ` + stringAcctIn + `.`);
    console.log(`Here are your new balances.`);
    doInquire();
}


/**
 * @method
 * @desc
 * @returns{method}
 */
function doWithdrawal() {
    console.log(`\x1Bc`);
    console.log(`\nWould you like to withdrawal from savings or checking? `);
    setCheckOrSaving();
    console.log(`\x1Bc`);
    requestAmount = null;
    while (requestAmount === null || requestAmount > MAX_TRANSACTION || requestAmount < MIN_TRANSACTION || !/[0-9]/.test(requestAmount)) {
        requestAmount = Number(PROMPT.question(`How much would you like to withdrawal from ` + stringAcctIn + `? `));
        if (requestAmount === null || requestAmount > MAX_TRANSACTION || requestAmount < MIN_TRANSACTION || !/[0-9]/.test(requestAmount)) {
            console.log(`not a valid option, please try again.`);
        }
    }
    if (checkOrSave === 1) {
        if ((savings - requestAmount) < MIN_BALANCE) {
            skip = 1;
        }
        else {
            savings -= requestAmount;
        }
    }
    else if (checkOrSave === 2) {
        if ((checking - requestAmount) < MIN_BALANCE) {
            skip = 1;
        }
        else {
            checking -= requestAmount;
        }
    }
    if (skip !== 1) {
        console.log(`\x1Bc`);
        console.log(`You have withdrawn $` + requestAmount + ` from ` + stringAcctIn + `.`);
        console.log(`Here are your new balances.`);
        doInquire();
    }
    else {
        console.log(`Insufficient funds to complete transaction, please check account balances and try again.`)
    }
}


/**
 * @method
 * @desc
 * @returns{method}
 */
function doTransfer() {
    console.log(`\x1Bc`);
    console.log(`Which account would you like to transfer into ? `);
    setCheckOrSaving();
    console.log(`\x1Bc`);
    requestAmount = null;
    skip = null;
    while (requestAmount === null || requestAmount > MAX_TRANSACTION || requestAmount < MIN_TRANSACTION || !/[0-9]/.test(requestAmount)) {
        requestAmount = Number(PROMPT.question(`How much would you like to transfer into ` + stringAcctIn + `? `));
        if (requestAmount === null || requestAmount > MAX_TRANSACTION || requestAmount < MIN_TRANSACTION || !/[0-9]/.test(requestAmount)) {
            console.log(`not a valid option, please try again.`);
        }
    }
    if (checkOrSave === 1) {
        if ((checking - requestAmount) < MIN_BALANCE) {
            skip = 1;
        }
        else {
            checking -= requestAmount;
            savings += requestAmount;
        }
    }
    else if (checkOrSave === 2) {
        if ((savings - requestAmount) < MIN_BALANCE) {
            skip = 1;
        }
        else {
            checking += requestAmount;
            savings -= requestAmount;
        }
}
    if (skip !== 1) {
        console.log(`\x1Bc`);
        console.log(`You have transferred $` + requestAmount + ` from ` + stringAcctOut + ` into ` + stringAcctIn + `.`);
        console.log(`Here are your new balances.`);
        doInquire();
    }
    else {
        console.log(`Insufficient funds to complete transaction, please check account balances and try again.`)
    }
}


function setCheckOrSaving() {
    action = null; //resets branchAction for next run
    checkOrSave = null;

    while (checkOrSave == null || checkOrSave > 2 || checkOrSave < 1 || !/[0-9]/.test(checkOrSave)) {
        checkOrSave = Number(PROMPT.question(` savings [1]  checking [2]: `));
        if (checkOrSave == null || checkOrSave > 2 || checkOrSave < 1 || !/[0-9]/.test(checkOrSave)) {
            console.log(`not a valid option, please try again.`);
        }
    }
    if (checkOrSave === 1){
        stringAcctIn = "Savings";
        stringAcctOut = "Checking";
    }
    else {
        stringAcctIn = "Checking";
        stringAcctOut = "Savings";
    }
}

/**
 * @method
 * @desc
 * @returns{method}
 */
function doInquire() {
    process.stdout.write(`\x1Bc`);
    action = null;
    console.log(`Current balance for savings is $` + savings.toFixed(2));
    console.log(`Current balance for checking is $` + checking.toFixed(2));
}

function setName() {
    console.log(`\x1Bc`);
    userName = PROMPT.question(`\nPlease enter user name: `)
}

function setEnterAcctNum() {
    verify = 0;
    while (inputAcct == null || acctIndexNum === -1 || !/[0-9]/.test(inputAcct)) {
        inputAcct = Number(PROMPT.question(`\n` + userName + ` please enter your account number: `));
        acctIndexNum = arrAcctNums.indexOf(inputAcct);
        if (inputAcct == null || acctIndexNum === -1 || !/[0-9]/.test(inputAcct)) {
            errorLog();
        }
    }
}

function setEnterPin() {
    verify = 0;
    while (acctIndexNum !== pinIndexNum || !/[0-9]/.test(inputPin)) {
        inputPin = Number(PROMPT.question(`Please enter your pin number: `));
        pinIndexNum = arrPinNums.indexOf(inputPin);
        if (acctIndexNum !== pinIndexNum || !/[0-9]/.test(inputPin)) {
            errorLog();
        }
    }
    console.log(`\x1Bc`);
    console.log(`Thank you, your account has been verified. `);
    verified = 1;
}

function errorLog() {
    verify++;
    if (verify < (MAX_ATTEMPT - 1)) {
        console.log(`Incorrect account / pin number. Please try again. `);
    }
    else if (verify < MAX_ATTEMPT) {
        console.log(`Incorrect account / pin number. Please try again. One attempt remaining. `);
    }
    else {
        console.log(`\x1Bc`);
        console.log(`Incorrect account / pin number. Contact customer service for assistance. `);
        return process.kill(process.pid);
    }
}