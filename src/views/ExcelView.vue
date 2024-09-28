<template>
	<el-container class="h-full">
		<el-header class="flex flex-col items-center justify-center h-16 bg-red-400">
			<h1 class="text-4xl">这是标题</h1>
		</el-header>
		<el-main class="flex flex-grow bg-green-400">
			<div class="flex-1">
				<el-table :data="原始数据" style="width: 120px">
					<el-table-column prop="date" label="Date" />
				</el-table>
			</div>
			<div class="flex-1">
				<el-table :data="原始数据" style="width: 120px">
					<el-table-column prop="date" label="Date" />
				</el-table>
			</div>
			<div class="flex-1">
				<el-table :data="原始数据" style="width: 120px">
					<el-table-column prop="date" label="Date" />
				</el-table>
			</div>
		</el-main>

		<el-footer class="flex flex-col items-center justify-center h-16 bg-red-400">
			<span class="text-3xl">footer</span>
		</el-footer>
	</el-container>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const 原始数据 = reactive([
	{
		date: '2016-05-02'
	},
	{
		date: '2016-05-03'
	},
	{
		date: '2016-05-02'
	},
	{
		date: '2016-05-03'
	},
	{
		date: '2016-05-02'
	},
	{
		date: '2016-05-03'
	}
])
const 对比数据 = reactive([
	{
		date: '2016-05-02'
	},
	{
		date: '2016-05-03'
	},
	{
		date: '2016-05-02'
	},
	{
		date: '2016-05-03'
	},
	{
		date: '2016-05-02'
	},
	{
		date: '2016-05-03'
	}
])
</script>
<style scoped lang="less">
.el-table {
	background-color: #882525;
}
</style>
