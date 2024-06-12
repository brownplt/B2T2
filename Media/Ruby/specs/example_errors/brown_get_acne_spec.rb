# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass
# rubocop:disable Metrics/BlockLength

# jellyNamed: a jelly bean table that contains booleans and strings
RSpec.describe 'brown jelly beans' do
  include Basics

  describe 'handles error as expected' do
    let(:raw_table_string) do
      "
      # | name       | get acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
      # | ---------- | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
      # | \"Emily\"    | true     | false | false | false | true  | false  | false | true   | false | false  |
      # | \"Jacob\"    | true     | false | true  | false | true  | true   | false | false  | false | false  |
      # | \"Emma\"     | false    | false | false | false | true  | false  | false | false  | true  | false  |
      # | \"Aidan\"    | false    | false | false | false | false | true   | false | false  | false | false  |
      # | \"Madison\"  | false    | false | false | false | false | true   | false | false  | true  | false  |
      # | \"Ethan\"    | true     | false | true  | false | false | false  | false | true   | true  | false  |
      # | \"Hannah\"   | false    | false | true  | false | false | false  | false | false  | true  | false  |
      # | \"Matthew\"  | true     | false | false | false | false | false  | true  | true   | false | false  |
      # | \"Hailey\"   | true     | false | false | false | false | false  | false | true   | false | false  |
      # | \"Nicholas\" | false    | true  | false | false | false | true   | true  | false  | true  | false  |
      "
    end

    let(:table) { TableEncoder.encode(raw_table_string) }

    context 'when happy path' do
      context 'when correct program' do
        # > brownAndGetAcne =
        #     function(r):
        #     getValue(r, "brown") and getValue(r, "get acne")
        #   end
        # > brownAndGetAcneTable =
        #   buildColumn(jellyNamed, "brown and get acne", brownAndGetAcne)
        # > count(brownAndGetAcneTable, "brown and get acne")
        let(:brown_and_get_acne) do
          lambda do |r|
            get_value(r, 'brown') && get_value(r, 'get acne')
          end
        end

        let(:brown_and_get_acne_table) do
          Table.build_column(table, { column_name: 'brown and get acne', sort: Boolean }) do |r|
            brown_and_get_acne.call(r)
          end
        end

        it 'returns the correct number of participants who like green' do
          result = Table.count(brown_and_get_acne_table, 'brown and get acne')

          # TODO: this was painful... why is this so painful?
          count_of_brown_and_acne = result
                                    .rows
                                    .select { |r| get_value(r, 'value') == true }
                                    .map { |r| get_value(r, 'count') }
                                    .first

          expect(count_of_brown_and_acne).to eq(1)
        end
      end
    end

    context 'when buggy program' do
      # > brownAndGetAcne =
      #     function(r):
      #       getValue(r, "brown") and getValue(r, "get acne")
      #     end
      # > brownAndGetAcneTable =
      #     buildColumn(jellyNamed, "part2", brownAndGetAcne)
      # > count(brownAndGetAcneTable, "brown and get acne")
      let(:brown_and_get_acne) do
        lambda do |r|
          get_value(r, 'brown') && get_value(r, 'get acne')
        end
      end

      let(:brown_and_get_acne_table) do
        Table.build_column(table, { column_name: 'part2', sort: Boolean }) do |r|
          brown_and_get_acne.call(r)
        end
      end

      it 'fails with require' do
        expect { Table.count(brown_and_get_acne_table, 'brown and get acne') }.to raise_error(RequireException)
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
# rubocop:enable Metrics/BlockLength
