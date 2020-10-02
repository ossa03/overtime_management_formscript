// これはフォームスクリプト
// フォーム送信のトリガー毎に、残業時間の差分と合計時間の算出をする

function myFunction() {
	// スプレッドシートのID
	const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
	// スプレッドシート取得
	const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
	// 回答先シート
	const currentSheet = ss.getSheetByName('当月')

	// This logs the value in the very last cell of this sheet
	const lastRow = currentSheet.getLastRow()
	const lastColumn = currentSheet.getLastColumn()
	const lastCell = currentSheet.getRange(lastRow, lastColumn)
	console.log(lastCell.getValue())

	// add Header of "残業時間"
	const headerRow = 1 // ヘッダー(1行目)
	const diffTimeColumn = 7 // 残業時間の列を7列目に指定
	// 残業時間のセルに"残業時間（分）"をセットする
	const diffTimeCell = currentSheet.getRange(headerRow, diffTimeColumn)
	if (diffTimeCell.getValue() !== '残業時間（分）') {
		diffTimeCell.clear()
		diffTimeCell.setValue('残業時間（分）')
	}

	// add Header of "合計"
	const totalColumn = 8 // 残業時間の列を8列目に指定
	// 残業時間のセルに"合計時間"をセットする
	const totalHeaderCell = currentSheet.getRange(headerRow, totalColumn)
	if (totalHeaderCell.getValue() !== '合計（分）') {
		totalHeaderCell.clear()
		totalHeaderCell.setValue('合計（分）')
	}

	// 最後の行にだけ残業開始時間と終了時間から残業時間を計算して残業時間のカラムにセットする場合
	// const overTimeStartColumn = 4
	// const overTimeEndColumn = 5
	//  let overTimeStart,overTimeEnd
	// ヘッダーはスキップする
	//  if (lastRow !== headerRow) {
	//   overTimeStart =  currentSheet.getRange(lastRow,overTimeStartColumn).getValue()
	//   overTimeEnd =  currentSheet.getRange(lastRow,overTimeEndColumn).getValue()
	//  }
	//
	//  const diffTime = parseInt((overTimeEnd - overTimeStart) / 1000 / 60)
	// 表示形式を数値の小数点なしに設定する
	//  lastCell.setNumberFormat("0");
	//  lastCell.setValue(diffTime)

	// 全てのレコードに対して同じ処理をする場合
	const allRange = currentSheet.getDataRange()
	const allRowValues = allRange.getValues()
	//  console.log("allvalues00::",allRowValues[0])

	allRowValues.forEach((rowValues, index) => {
		if (index === 0) return true
		const overTimeStartColumn = 3 //残業開始時間の列 ４列目だが、配列操作なので4-1で3
		const overTimeEndColumn = 4 //残業終了時間の列 5列目だが、配列操作なので5-1で4
		//   const diffTimeColumn = 7   // 7列目を指定
		const overTimeStart = rowValues[overTimeStartColumn] //Date型
		// console.log('開始時間:', overTimeStart)
		const overTimeEnd = rowValues[overTimeEndColumn] //Date型
		// console.log('終了時間:', overTimeEnd)
		// console.log('差分時間:', overTimeEnd - overTimeStart)
		console.log('差分時間のデータ型:', typeof (overTimeEnd - overTimeStart)) //Number型で返ってくる
		const diffTime = (overTimeEnd - overTimeStart) / 1000 / 60
		// console.log('difftime分::', diffTime)
		// console.log('difftype::', typeof diffTime) //Number型で返ってくる

		const currentRow = index + 1
		const currentDiffTimeCell = currentSheet.getRange(currentRow, diffTimeColumn)
		// 表示形式を数値の小数点なしに設定する
		//    currentDiffTimeCell.setNumberFormat("0");
		currentDiffTimeCell.setValue(diffTime)
	})

	//// 残業時間の合計のセルに毎回上書きする
	// 合計値を記入するセル
	const totalTimeCell = currentSheet.getRange(2, totalColumn)
	// リファレンス: getRange(row, column, numRows)
	// 合計時間の元になるデータレンジ
	const totalTimeRange = currentSheet.getRange(2, diffTimeColumn, lastRow)
	// 合計時間
	let totalTime = 0
	console.log('totalTimeRange.getValues():::', totalTimeRange.getValues())
	totalTimeRange.getValues().forEach((value, index) => {
		console.log('value[0]::', value[0])
		const time = value[0]
		totalTime += time
	})

	//合計時間をセットする
	console.log('totalTime::', totalTime)
	// すでにセットされている合計時間を削除する
	totalTimeCell.clear()
	// 表示形式を数値の小数点なしに設定する
	totalTimeCell.setNumberFormat('0')
	// 新たに計算し直した合計時間をセットする
	totalTimeCell.setValue(totalTime)
	console.log('totalTime::', totalTime)
}
