<script lang="ts">
	import { Checkbox } from "#/ui/checkbox";
	import { FlexRender } from "#/ui/data-table";
  import * as Table from "#/ui/table";
</script>

<div class="overflow-hidden rounded-md border">
 <Table.Root>
    <Table.Header class="bg-muted sticky top-0 z-10">
      <Table.Row>
        <Table.Head>
          <Checkbox />
        </Table.Head>
        <Table.Head>
          abc
        </Table.Head>
      </Table.Row>
    </Table.Header>

    <Table.Body class="**:data-[slot=table-cell]:first:w-8">
      <Table.Row>
        <Table.Cell>
          <Checkbox />
        </Table.Cell>
        <Table.Cell>
          abc
        </Table.Cell>
      </Table.Row>
    </Table.Body>
 </Table.Root>
</div>